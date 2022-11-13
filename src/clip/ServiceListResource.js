const Resource = require('./Resource');

class ServiceListResource extends Resource {
    constructor(item) {
        super(item);
        //console.log("ServiceListResource["+this.rtype()+","+this.id()+"].constructor()");
        this.rids = [];
        this.services = {};

        var instance = this;
        setTimeout(function () {
            if (item.services) {
                item.services.forEach(service => {
                    instance.rids.push(service.rid);
                    instance.emit('getService',service.rid);
                },500);
            } else {
                console.log("ServiceListResource["+instance.rtype()+","+instance.id()+"].constructor(): no services found!");
                //console.log(item);
            }
        });
    }

    destructor() {
        //console.log("ServiceListResource["+this.rtype()+","+this.id()+"].destructor()");
        this.services = null;
        super.destructor();
    }

    onServiceAvailable(rid,service) {
        //console.log("ServiceListResource["+this.rtype()+","+this.id()+"].onServiceAvailable("+rid+")");
        this.services[rid] = service;
    }

    getServiceTypes() {
        //console.log("ServiceListResource["+this.rtype()+","+this.id()+"].getServiceTypes()");
        var result = [];
        var services = this.services;
        this.rids.forEach((rid) => {
            result.push(services[rid].item.type);
        });
        return result;
    }

    getServicesByType(type) {
        //console.log("ServiceListResource["+this.rtype()+","+this.id()+"].getServicesByType("+type+")");
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