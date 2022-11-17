const events = require('events');
const EventSource = require('eventsource');
const { emit } = require('process');
const RestApi = require('../RestApi');

const Resource = require('./Resource');
const ServiceListResource = require('./ServiceListResource');

var registeredBridges = [];

class ClipApi extends events.EventEmitter {

    factory =  {
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
        console.log("ClipApi.constructor(",ip,",",key,")");
        this.name = name;
        this.ip = ip;
        this.key = key;
        this.resources = {};

        this.restAPI = new RestApi(name,ip,500,{"hue-application-key": key});

        var eventsurl = "https://" + ip + "/eventstream/clip/v2";
        this.eventSource = new EventSource(eventsurl, {
            headers: { 'hue-application-key': this.key },
            https: { rejectUnauthorized: false },
        });

        this.eventSource.onmessage = (streammessage) => {
            const messages = JSON.parse(streammessage.data);
            messages.forEach((message) => {
                message.data.forEach((event) => {
                    if (Object.keys(this.resources).includes(event.id)) {
                        this.resources[event.id].onEvent(event);
                    }
                });
            });
        };

        registeredBridges.push(this);

        this.setMaxListeners(1024);
        var instance = this;
        this.restAPI.get("/clip/v2/resource")
        .then(function (response) {

            response.data.forEach((item) => {
                if (Object.keys(instance.factory).includes(item.type)) {
                    if (!instance.isResourceRegistered(item.id)) {
                        var resource = new instance.factory[item.type](item,instance);
                        instance.registerResource(resource);
                    }
                } else {
                    console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].constructor(): Missing factory for type", item.type);
                }
            });
            instance.emit('started');
        });
    }

    destructor() {
        console.log("ClipApi[" + (this.name? this.name: this.ip) + "].destructor()");
        this.emit('stopped');

        var index = ClipApi.register.indexOf(this);
        if (index) {
            ClipApi.register.remove(index);
        }

        if (this.eventSource != null) {
            this.eventSource.close();
        };

        this.eventSource = null;

        var instance = this;
        Object.keys(this.resources).forEach((id) => {
            var resource = instance.resource[id];
            instance.unregisterResource(resource);
            resource.destructor();
        });

        this.resources = null;
        this.removeAllListeners();
    }

    get(rtype,rid) {
        return this.restAPI.get("/clip/v2/resource/" + rtype + "/" + rid);
    }

    put(rtype,rid,data) {
        return this.restAPI.put("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    post(rtype,rid,data) {
        return this.restAPI.post("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    delete(rtype,rid,data) {
        return this.restAPI.delete("/clip/v2/resource/" + rtype + "/" + rid, data);
    }

    isResourceRegistered(id) {
        return Object.keys(this.resources).includes(id);
    }

    registerResource(resource) {
        //console.log("ClipApi[" + (this.name? this.name: this.ip) + "].registerResource()");
        this.resources[resource.rid()] = resource;
    }

    unregisterResource(resource) {
        //console.log("ClipApi[" + (this.name? this.name: this.ip) + "].unregisterResource()");
        this.resources.remove(resource.rid());
    }

    getSortedServicesById(uuid,rtype="device") {
        //console.log("ClipApi[" + this.name + "].getSortedServicesById(" + uuid + "," + rtype + ")");

        var services = [];
        Object.values(this.resources[uuid].services).forEach(service => {
            services.push(service);
        });

        if (services) {
            services.sort(function (a, b) {
                if (a.typeName() > b.typeName()) return 1;
                if (a.typeName() < b.typeName()) return -1;
                return 0;
            });
        }
        services.unshift(this.resources[uuid]);

        return services;
    }

    getSortedResourcesByTypeAndModel(type,models) {
        //console.log("ClipApi[" + this.name + "].getSortedResourcesByTypeAndModel(",type,",",models,")");
        var instance = this;
        var keys = Object.keys(instance.resources).filter(function(key) {
            var value = instance.resources[key];
            return ((value.rtype() == type))
        });

        var result = []
        keys.forEach((key) => {
            result.push(instance.resources[key]);
        });

        result.sort(function (a, b) {
            if (a.id() > b.id()) return 1;
            if (a.id() < b.id()) return -1;
            return 0;
        });

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

        return options;
    }
}

module.exports = ClipApi