const Resource = require('./Resource');

const _error = require('debug')('error').extend('ServiceListResource');
const _warn  = require('debug')(' warn').extend('ServiceListResource');
const _info  = require('debug')(' info').extend('ServiceListResource');
const _trace = require('debug')('trace').extend('ServiceListResource');

class ServiceListResource extends Resource {
    #clip;
    #rids;

    #error;
    #warn;
    #info;
    #trace;

    constructor(item,clip) {
        super(item,clip);

        this.#error = _error.extend("["+this.id()+"]");
        this.#warn  = _warn. extend("["+this.id()+"]");
        this.#info  = _info. extend("["+this.id()+"]");
        this.#trace = _trace.extend("["+this.id()+"]");

        this.#info("constructor()");
        this.#rids = [];
        this.#clip = clip;
    }

    destructor() {
        this.#info("destructor()");
        this.#clip = null;
        super.destructor();
    }

    getServices() {
        this.#info("getServices()");
        var result = {};
        if ((this.item()) && (this.item().services))
        {
            this.item().services.forEach(service => {
                this.#trace("getServices()  service:",service);
                var resource = this.#clip.getResource(service.rid);
                if (resource) {
                    result[service.rid] = resource;
                }
            });
        }
        return result;
    }

    getServiceTypes() {
        this.#info("getServiceTypes()");
        var result = [];
        var services = this.getServices();
        this.#rids.forEach((rid) => {
            result.push(services[rid].item.type);
        });
        return result;
    }

    getServicesByType(type) {
        this.#info("getServicesByType("+type+")");
        var result = [];
        var services = this.getServices();
        this.#rids.forEach((rid) => {
            if (services[rid].item.type == type) {
                result.push(services[rid]);
            }
        });
        return result;
    }
}

module.exports = ServiceListResource;