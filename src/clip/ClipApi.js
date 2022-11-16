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
                    //console.log("ClipApi.constructor(",ip,",",key,").onmessage()");
                    //console.log(event);
                    if (Object.keys(this.resources).includes(event.id)) {
                        //console.log(this.resources[event.id]);
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
                        var resource = new instance.factory[item.type](item);
                        instance.registerResource(resource);
                    }
                } else {
                    console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].constructor(): Missing factory for type", item.type);
                    //console.log(item);
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

    isResourceRegistered(id) {
        return Object.keys(this.resources).includes(id);
    }

    registerResource(resource) {
        //console.log("ClipApi[" + (this.name? this.name: this.ip) + "].registerResource()");
        this.resources[resource.rid()] = resource;

        var instance = this;
        this._onPut = function(data) {
            //console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].registerResource(): on('put')");
            instance.restAPI.put("/clip/v2/resource/" + resource.rtype() + "/" + resource.rid(), data);
        }
        this._onPost = function(data) {
            instance.restAPI.post("/clip/v2/resource/" + resource.rtype() + "/" + resource.rid(), data);
        }
        this._onDelete = function(data) {
            instance.restAPI.delete("/clip/v2/resource/" + resource.rtype() + "/" + resource.rid(), data);
        }
        this._onGetService = function(id) {
            if (Object.keys(instance.resources).includes(id)) {
                resource.onServiceAvailable(id,instance.resources[id]);
            } else {
                console.log("ClipApi[" + (instance.name? instance.name: instance.ip) + "].registerResource().on('getService'): Service "+id+" not yet available.");
                //this.queueServiceRequest(resource,id);
            }
        }

        resource.on('put',this._onPut);
        resource.on('post',this._onPost);
        resource.on('delete',this._onDelete);
        resource.on('getService',this._onGetService);
    }

    unregisterResource(resource) {
        //console.log("ClipApi[" + (this.name? this.name: this.ip) + "].unregisterResource()");

        resource.off('getService',this._onGetService);
        resource.off('delete',this._onDelete);
        resource.off('post',this._onPost);
        resource.off('put',this._onPut);

        this.resources.remove(resource.rid());
    }

    getSortedServicesById(uuid,rtype="device") {
        //console.log("ClipApi[" + this.name + "].getSortedServicesById(" + uuid + "," + rtype + ")");

        var services = [];
        Object.keys(this.resources[uuid].services).forEach(service => {
            services.push(this.resources[uuid].services[service]);
        });

        if (services) {
            services.sort(function (a, b) {
                if (a.rtype() > b.rtype()) return 1;
                if (a.rtype() < b.rtype()) return -1;
                return 0;
            });
        }

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
            options.push({ value: resource.rid(), label: resource.id() });
        });

        return options;
    }
}

module.exports = ClipApi