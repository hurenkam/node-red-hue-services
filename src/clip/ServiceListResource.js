const Resource = require('./Resource');

class ServiceListResource extends Resource {
    #clip;

    constructor(item,clip) {
        super(item,clip);
        //console.log("ServiceListResource["+this.id()+"].constructor()");
        this.rids = [];
        this.#clip = clip;
    }

    destructor() {
        //console.log("ServiceListResource["+this.id()+"].destructor()");
        this.#clip = null;
        super.destructor();
    }

    getServices() {
        var result = {};
        if ((this.item) && (this.item.services))
        {
            this.item.services.forEach(service => {
                //console.log("ServiceListResource["+this.id()+"].getServices()  service:",service);
                var resource = this.#clip.getResource(service.rid);
                if (resource) {
                    result[service.rid] = resource;
                }
            });
        }
        return result;
    }

    getServiceTypes() {
        //console.log("ServiceListResource["+this.id()+"].getServiceTypes()");
        var result = [];
        var services = this.getServices();
        this.rids.forEach((rid) => {
            result.push(services[rid].item.type);
        });
        return result;
    }

    getServicesByType(type) {
        //console.log("ServiceListResource["+this.id()+"].getServicesByType("+type+")");
        var result = [];
        var services = this.getServices();
        this.rids.forEach((rid) => {
            if (services[rid].item.type == type) {
                result.push(services[rid]);
            }
        });
        return result;
    }
}

module.exports = ServiceListResource;