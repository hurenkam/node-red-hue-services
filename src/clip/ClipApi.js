const events = require('events');
const EventSource = require('eventsource');
const RestApi = require('../RestApi');

const Resource = require('./Resource');
const ServiceListResource = require('./ServiceListResource');

const _error = require('debug')('error').extend('ClipApi');
const _warn  = require('debug')(' warn').extend('ClipApi');
const _info  = require('debug')(' info').extend('ClipApi');
const _trace = require('debug')('trace').extend('ClipApi');

class ClipApi extends events.EventEmitter {
    #restAPI;
    #resources;
    #startQ;
    #isStarted;
    #name;
    #ip;
    #key;

    #error;
    #warn;
    #info;
    #trace;

    #factory =  {
        "behavior_script": Resource,
        "behavior_instance": Resource,
        "bridge": Resource,
        "bridge_home": ServiceListResource,
        "button": Resource,
        "device": ServiceListResource,
        "device_power": Resource,
        "entertainment": Resource,
        "entertainment_configuration": Resource,
        "geolocation": Resource,
        "grouped_light": Resource,
        "homekit": Resource,
        "light": Resource,
        "light_level": Resource,
        "matter": Resource,
        "motion": Resource,
        "relative_rotary": Resource,
        "room": ServiceListResource,
        "scene": Resource,
        "temperature": Resource,
        "zgp_connectivity": Resource,
        "zigbee_connectivity": Resource,
        "zigbee_device_discovery": Resource,
        "zone": ServiceListResource
    };

    constructor(ip,key,name) {
        super();
        this.#name = name;
        this.#ip = ip;
        this.#key = key;
        this.#resources = {};
        this.#startQ = [];
        this.#isStarted = false;

        this.#error = _error.extend("["+name+"]");
        this.#warn  = _warn. extend("["+name+"]");
        this.#info  = _info. extend("["+name+"]");
        this.#trace = _trace.extend("["+name+"]");

        this.#info("constructor("+ip+","+key+","+name+")");

        var eventsurl = "https://" + ip + "/eventstream/clip/v2";
        this.eventSource = new EventSource(eventsurl, {
            headers: { 'hue-application-key': this.#key },
            https: { rejectUnauthorized: false },
        });

        this.eventSource.onmessage = (streammessage) => {
            const messages = JSON.parse(streammessage.data);
            messages.forEach((message) => {
                message.data.forEach((event) => {
                    if (Object.keys(this.#resources).includes(event.id)) {
                        this.#resources[event.id].onEvent(event);
                    }
                });
            });
        };

        var instance = this;
        var handleResourceList = async function(response) {
            response.data.forEach((item) => {constructor(",ip,",",key,")
                instance.#trace("constructor()  found resource:", item);

                if (Object.keys(instance.#factory).includes(item.type)) {
                    if (!instance.#isResourceRegistered(item.id)) {
                        var resource = new instance.#factory[item.type](item,instance);
                        instance.#registerResource(resource);
                    }
                } else {
                    instance.#warn("constructor(): Missing factory for type", item.type);
                }
            });

            instance.#startQ.forEach(resource => resource.start(instance.#resources[resource.rid()]));
            instance.#isStarted = true;
            instance.#startQ = null;
        };

        var handleError = async function(error) {
            instance.#error("constructor()  error:", error);
        }

        this.#restAPI = new RestApi(
            instance.#name,
            instance.#ip,
            { tokensPerInterval: 3, interval: "second" },
            {"hue-application-key": instance.#key}
        );
        this.#restAPI.get("/clip/v2/resource")
            .then(handleResourceList)
            .catch(handleError);
    }

    requestStartup(resource) {
        if (this.#isStarted) {
            resource.start();
        } else {
            this.#startQ.push(resource);
        }
    }

    destructor() {
        this.#info("destructor()");
        this.emit('stopped');
        this.removeAllListeners();
        this.#restAPI.destructor();

        if (this.eventSource != null) {
            this.eventSource.onmessage = null;
            this.eventSource.close();
            delete this.eventSource();
        };

        this.eventSource = null;

        var instance = this;
        Object.keys(this.#resources).forEach((id) => {
            var resource = instance.resource[id];
            instance.#unregisterResource(resource);
            resource.destructor();
        });

        this.resources = null;
    }

    getResource(rid) {
        if (this.#isResourceRegistered(rid)) {
            return this.#resources[rid];
        } else {
            this.#warn("getResource(",rid,"): Resource not found.");
        }
    }

    get(rtype,rid) {
        this.#trace("get(",rtype,",",rid,")");
        return this.#restAPI.get("/clip/v2/resource/" + rtype + "/" + rid);
    }

    put(rtype,rid,data) {
        this.#trace("put(",rtype,",",rid,",",data,")");
        return this.#restAPI.put("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    post(rtype,rid,data) {
        this.#trace("post(",rtype,",",rid,",",data,")");
        return this.#restAPI.post("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    delete(rtype,rid,data) {
        this.#trace("delete(",rtype,",",rid,",",data,")");
        return this.#restAPI.delete("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    #isResourceRegistered(uuid) {
        return Object.keys(this.#resources).includes(uuid);
    }

    #registerResource(resource) {
        this.#trace("#registerResource(",resource.id(),")");
        this.#resources[resource.rid()] = resource;
    }

    #unregisterResource(resource) {
        this.#trace("#unregisterResource()");
        this.#resources.remove(resource.rid());
    }

    getSortedServicesById(uuid) {
        this.#trace("getSortedServicesById(" + uuid + "," + rtype + ")");

        var services = [];
        Object.values(this.#resources[uuid].services).forEach(service => {
            services.push(service);
        });

        if (services) {
            services.sort(function (a, b) {
                if (a.typeName() > b.typeName()) return 1;
                if (a.typeName() < b.typeName()) return -1;
                return 0;
            });
        }
        services.unshift(this.#resources[uuid]);

        //this.#trace("getSortedServicesById(" + uuid + "," + rtype + ") services:",services);
        return services;
    }

    getSortedResourcesByTypeAndModel(type,models) {
        this.#trace("getSortedResourcesByTypeAndModel(",type,",",models,")");
        var instance = this;
        var keys = Object.keys(instance.#resources).filter(function(key) {
            var value = instance.resources[key];
            return ((value.rtype() == type))
        });

        var result = []
        keys.forEach((key) => {
            result.push(instance.#resources[key]);
        });

        result.sort(function (a, b) {
            if (a.id() > b.id()) return 1;
            if (a.id() < b.id()) return -1;
            return 0;
        });

        //this.#trace("getSortedResourcesByTypeAndModel(",type,",",models,") options:",options);
        return result.filter(function(resource) {
            if ((models) && (resource.item.product_data) && (resource.item.product_data.model_id)) {
                return models.includes(resource.item.product_data.model_id);
            } else {
                return true;
            }
        });
    }

    getSortedResourceOptions(type, models) {
        this.#trace("getSortedOptions(" + type + "," + models + ")");

        var options = [];
        var resources = this.getSortedResourcesByTypeAndModel(type,models);
        resources.forEach((resource) => {
            options.push({ value: resource.rid(), label: (resource.name()? resource.name() : resource.id()) });
        });

        options.sort(function (a, b) {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        });

        this.#trace("getSortedOptions(" + type + "," + models + ") options:",options);
        return options;
    }

    getSortedTypeOptions() {
        this.#trace("getSortedTypeOptions()");
        var options = [];
        var rtypes = [];
        Object.values(this.#resources).forEach((resource)=>{
            if (resource.owner()) {
                if (!rtypes.includes(resource.rtype())) {
                    rtypes.push(resource.rtype());
                    options.push({ value: resource.rtype(), label: resource.rtype()});
                }
            }
        });

        options.sort(function (a, b) {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        });

        this.#trace("getSortedTypeOptions() options:",options);
        return options;
    }

    getSortedOwnerOptions(rtype) {
        this.#trace("getSortedOwnerOptions(" + rtype + ")");

        var options = [];
        var rids = [];
        Object.values(this.#resources).forEach((resource)=>{
            if (resource.getServices) {
                Object.values(resource.getServices()).forEach((service) => {
                    if ((service.rtype() == rtype) && (!rids.includes(resource.rid()))) {
                        rids.push(resource.rid());
                        options.push({ value: resource.rid(), label: resource.name() });
                    }
                });
            }
        });

        options.sort(function (a, b) {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        });

        this.#trace("getSortedOwnerOptions(" + rtype + ") options:",options);
        return options;
    }

    getSortedServiceOptions(uuid,rtype) {
        this.#trace("getSortedServiceOptions("+ uuid + "," + rtype + ")");

        var options = [];
        var owner = this.#resources[uuid];
        var services = owner.getServices();
        Object.values(services).forEach((service) => {
            if (service.rtype() == rtype) {
                options.push({ value: service.rid(), label: service.typeName() });
            }
        });

        options.sort(function (a, b) {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        });

        this.#trace("getSortedServiceOptions("+ uuid + "," + rtype + ") options:",options);
        return options;
    }
}

module.exports = ClipApi