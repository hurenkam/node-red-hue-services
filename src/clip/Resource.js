const events = require('events');

const _error = require('debug')('error').extend('Resource');
const _warn  = require('debug')('warn').extend('Resource');
const _info  = require('debug')('info').extend('Resource');
const _trace = require('debug')('trace').extend('Resource');

class Resource extends events.EventEmitter {
    #clip;
    #item;

    #error;
    #warn;
    #info;
    #trace;

    constructor(item,clip) {
        super();
        this.#item = item;
        this.#clip = clip;

        this.#error = _error.extend("["+this.id()+"]");
        this.#warn  = _warn. extend("["+this.id()+"]");
        this.#info  = _info. extend("["+this.id()+"]");
        this.#trace = _trace.extend("["+this.id()+"]");

        this.#info("constructor()");
    }

    destructor() {
        this.#info("destructor()");
        this.removeAllListeners();
        this.#clip = null;
        this.#item = null;
    }

    clip() {
        return this.#clip;
    }

    item() {
        return this.#item;
    }

    id() {
        var id = this.rtype()+"/"+this.rid()
        var name = this.name();
        return id + (name? " ("+name+")":"");
    }

    rid() {
        return this.#item.id;
    }

    rtype() {
        return this.#item.type;
    }

    owner() {
        var result = null;

        if (this.#item.owner) {
            result = this.clip().getResource(this.#item.owner.rid);
        }

        return result;
    }

    name() {
        if ((this.#item.metadata) && (this.#item.metadata.name))
            return this.#item.metadata.name;

        if ((this.owner()) && (this.owner().name())) {
            return this.owner().name();
        }

        return null;
    }

    typeName() {
        var result = this.rtype();
        if ((this.#item.metadata) && (this.#item.metadata.control_id))
            result += this.#item.metadata.control_id;
        return result;
    }

    services() {
        this.#info("getServices()");
        var result = {};
        if ((this.item()) && (this.item().services))
        {
            this.item().services.forEach(service => {
                this.#trace("getServices()  service:",service);
                var resource = this.clip().getResource(service.rid);
                if (resource) {
                    result[service.rid] = resource;
                }
            });
        }
        return result;
    }

    get() {
        this.#trace("get()");
        return this.clip().get(this.rtype(),this.rid());
    }

    put(data) {
        this.#trace("put(",data,")");
        this.clip().put(this.rtype(),this.rid(), data);
    }

    onEvent(event) {
        this.#trace("onEvent()",event);
        this.updateStatus(event);
        this.emit('update',event);
    }

    updateStatus(event) {
        this.#trace("updateStatus()",event);
        const blacklist = ["id", "id_v1", "owner", "type"];

        var instance = this;
        Object.keys(event).forEach((key) => {
            if (!blacklist.includes(key)) {
                instance.#item[key] = event[key];
            }
        });
    }
}

module.exports = Resource;
