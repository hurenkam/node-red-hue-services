const events = require('events');
const EventSource = require('eventsource');
const RestApi = require('../RestApi');

const Resource = require('./Resource');
const ServiceListResource = require('./ServiceListResource');

class ClipApi extends events.EventEmitter {
    #restAPI;
    #resources;

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
        console.log("ClipApi[" + name + "].constructor(",ip,",",key,")");
        this.name = name;
        this.ip = ip;
        this.key = key;
        this.#resources = {};

        var eventsurl = "https://" + ip + "/eventstream/clip/v2";
        this.eventSource = new EventSource(eventsurl, {
            headers: { 'hue-application-key': this.key },
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
            response.data.forEach((item) => {
                //console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].constructor()  found resource:", resource);

                if (Object.keys(instance.#factory).includes(item.type)) {
                    if (!instance.#isResourceRegistered(item.id)) {
                        var resource = new instance.#factory[item.type](item,instance);
                        instance.#registerResource(resource);
                    }
                } else {
                    console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].constructor(): Missing factory for type", item.type);
                }

            });
        };

        var handleError = async function(error) {
            console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].constructor()  error:", error);
        }

        this.#restAPI = new RestApi(instance.name,instance.ip,500,{"hue-application-key": instance.key});
        this.#restAPI.get("/clip/v2/resource")
            .then(handleResourceList)
            .catch(handleError);
    }

    destructor() {
        console.log("ClipApi[" + (this.name? this.name: this.ip) + "].destructor()");
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
            //console.log("ClipApi[" + (this.name? this.name: this.ip) + "].getResource(",rid,"): Resource not found.");
        }
    }

    get(rtype,rid) {
        return this.#restAPI.get("/clip/v2/resource/" + rtype + "/" + rid);
    }

    put(rtype,rid,data) {
        return this.#restAPI.put("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    post(rtype,rid,data) {
        return this.#restAPI.post("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    delete(rtype,rid,data) {
        return this.#restAPI.delete("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    #isResourceRegistered(uuid) {
        return Object.keys(this.#resources).includes(uuid);
    }

    #registerResource(resource) {
        console.log("ClipApi[" + (this.name? this.name: this.ip) + "].registerResource(",resource.id(),")");
        this.#resources[resource.rid()] = resource;
    }

    #unregisterResource(resource) {
        console.log("ClipApi[" + (this.name? this.name: this.ip) + "].unregisterResource()");
        this.#resources.remove(resource.rid());
    }

    getSortedServicesById(uuid) {
        //console.log("ClipApi[" + this.name + "].getSortedServicesById(" + uuid + "," + rtype + ")");

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

        return services;
    }

    getSortedResourcesByTypeAndModel(type,models) {
        //console.log("ClipApi[" + this.name + "].getSortedResourcesByTypeAndModel(",type,",",models,")");
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

        console.log(result);

        return result.filter(function(resource) {
            if ((models) && (resource.item.product_data) && (resource.item.product_data.model_id)) {
                return models.includes(resource.item.product_data.model_id);
            } else {
                return true;
            }
        });
    }

    getSortedResourceOptions(type, models) {
        //console.log("ClipApi[" + this.name + "].getSortedOptions(" + type + "," + models + ")");

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

        return options;
    }

    getSortedTypeOptions() {
        console.log("ClipApi[" + this.name + "].getSortedTypeOptions()");
        var options = [];
        var rtypes = [];
        Object.values(this.resources).forEach((resource)=>{
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

        return options;
    }

    getSortedOwnerOptions(rtype) {
        console.log("ClipApi[" + this.name + "].getSortedOwnerOptions(" + rtype + ")");

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

        return options;
    }

    getSortedServiceOptions(uuid,rtype) {
        console.log("ClipApi[" + this.name + "].getSortedServiceOptions("+ uuid + "," + rtype + ")");

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

        return options;
    }
}

module.exports = ClipApi