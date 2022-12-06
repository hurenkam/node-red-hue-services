const events = require('events');
const EventSource = require('eventsource');
const RestApi = require('../RestApi');

const Resource = require('./Resource');

const _error = require('debug')('error').extend('ClipApi');
const _warn  = require('debug')('warn').extend('ClipApi');
const _info  = require('debug')('info').extend('ClipApi');
const _trace = require('debug')('trace').extend('ClipApi');

class ClipApi extends events.EventEmitter {
    #restAPI;
    #resources;
    #startQ;
    #isStarted;
    #name;
    #ip;
    #key;
    #eventSource;

    #error;
    #warn;
    #info;
    #trace;

    #factory =  {
        "behavior_script": Resource,
        "behavior_instance": Resource,
        "bridge": Resource,
        "bridge_home": Resource,
        "button": Resource,
        "device": Resource,
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
        "room": Resource,
        "scene": Resource,
        "temperature": Resource,
        "zgp_connectivity": Resource,
        "zigbee_connectivity": Resource,
        "zigbee_device_discovery": Resource,
        "zone": Resource
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

        this.#restAPI = this._initRestApi();
        this.#eventSource = this._initEventStream();
        this._requestResources();
    }

    _initRestApi() {
        var restAPI = new RestApi(
            this.#name,
            this.#ip,
            { tokensPerInterval: 3, interval: "second" },
            {"hue-application-key": this.#key}
        );
        return restAPI;
    }

    _initEventStream() {
        this.#info("_initEventStream()");

        var url = "https://" + this.#ip + "/eventstream/clip/v2";
        var eventSource = new EventSource(url, {
            headers: { 'hue-application-key': this.#key },
            https: { rejectUnauthorized: false },
        });

        eventSource.onmessage = (streammessage) => {
            this._processStreamMessage(streammessage);
        };

        return eventSource;
    }

    _processStreamMessage(streammessage) {
        this.#trace("_processStreamMessage()");

        const messages = JSON.parse(streammessage.data);
        messages.forEach((message) => {
            message.data.forEach((event) => {
                this._processStreamEvent(event);
            });
        });
    }

    _processStreamEvent(event) {
        this.#trace("_processStreamEvent(",event,")");

        if (this._isResourceRegistered(event.id)) {
            this.getResource(event.id).onEvent(event);
        }
    }

    _requestResources() {
        this.#info("_requestResources()");
        var instance = this;

        var handleResourceList = async function(response) {
            instance._processResources(response);
        };

        var handleError = async function(error) {
            instance.#error("constructor()  error:", error.message,error.stack);
        }

        this.#restAPI.get("/clip/v2/resource")
            .then(handleResourceList)
            .catch(handleError);
    }

    _processResources(response) {
        this.#info("_processResources()");

        response.data.forEach((item) => {
            this.#trace("constructor()  found resource:", item);

            if (Object.keys(this.#factory).includes(item.type)) {
                if (!this._isResourceRegistered(item.id)) {
                    var resource = new this.#factory[item.type](item,this);
                    this._registerResource(resource);
                }
            } else {
                this.#warn("constructor(): Missing factory for type", item.type);
            }
        });

        this.#startQ.forEach(resource => resource.start(this.#resources[resource.rid()]));
        this.#isStarted = true;
        this.#startQ = null;
    }

    _isResourceRegistered(uuid) {
        return Object.keys(this.#resources).includes(uuid);
    }

    _registerResource(resource) {
        this.#trace("#registerResource(",resource.id(),")");
        this.#resources[resource.rid()] = resource;
    }

    _unregisterResource(resource) {
        this.#trace("#unregisterResource()");
        this.#resources.remove(resource.rid());
    }

    _stopEventStream() {
        this.#info("_stopEventStream()");
        if (this.#eventSource != null) {
            this.#eventSource.onmessage = null;
            this.#eventSource.close();
            //delete this.#eventSource;
        };

        this.#eventSource = null;
    }

    requestStartup(resource) {
        this.#trace("requestStartup()");
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
        if (this.#restAPI) {
            this.#restAPI.destructor();
            this.#restAPI = null;
        }
        this._stopEventStream();

        var instance = this;
        Object.keys(this.#resources).forEach((id) => {
            var resource = instance.resource[id];
            instance._unregisterResource(resource);
            resource.destructor();
        });

        this.resources = null;
    }

    getResource(rid) {
        if (this._isResourceRegistered(rid)) {
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
            if ((models) && (resource.data().product_data) && (resource.data().product_data.model_id)) {
                return models.includes(resource.data().product_data.model_id);
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
            if (resource.services) {
                Object.values(resource.services()).forEach((service) => {
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
        var services = owner.services();
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