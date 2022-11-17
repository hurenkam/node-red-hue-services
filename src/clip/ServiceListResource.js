const Resource = require('./Resource');

class ServiceListResource extends Resource {
    constructor(item,clip) {
        super(item,clip);
        //console.log("ServiceListResource["+this.id()+"].constructor()");
        this.rids = [];
        this.services = {};

        var instance = this;
        setTimeout(function () {
            if (item.services) {
                item.services.forEach(service => {
                    instance.rids.push(service.rid);
                    //instance.emit('getService',service.rid);
                    if (Object.keys(instance.clip.resources).includes(service.rid)) {
                        instance.onServiceAvailable(service.rid,instance.clip.resources[service.rid]);
                    } else {
                        console.log("ServiceListResource[" + instance.id() + "].constructor(): Service "+service.rid+" not yet available.");
                        //this.queueServiceRequest(resource,id);
                    }
                },200);
            } else {
                console.log("ServiceListResource["+instance.rtype()+","+instance.id()+"].constructor(): no services found!");
                //console.log(item);
            }
        });
    }

    destructor() {
        //console.log("ServiceListResource["+this.id()+"].destructor()");
        this.services = null;
        super.destructor();
    }

    onServiceAvailable(rid,service) {
        //console.log("ServiceListResource["+this.id()+"].onServiceAvailable("+rid+")");
        this.services[rid] = service;
    }

    getServiceTypes() {
        //console.log("ServiceListResource["+this.id()+"].getServiceTypes()");
        var result = [];
        var services = this.services;
        this.rids.forEach((rid) => {
            result.push(services[rid].item.type);
        });
        return result;
    }

    getServicesByType(type) {
        //console.log("ServiceListResource["+this.id()+"].getServicesByType("+type+")");
        var result = [];
        var services = this.services;
        this.rids.forEach((rid) => {
            if (services[rid].item.type == type) {
                result.push(services[rid]);
            }
        });
        return result;
    }
}

module.exports = ServiceListResource;