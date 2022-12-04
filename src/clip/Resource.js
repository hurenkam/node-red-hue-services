const events = require('events');

const _error = require('debug')('error').extend('Resource');
const _warn  = require('debug')('warn').extend('Resource');
const _info  = require('debug')('info').extend('Resource');
const _trace = require('debug')('trace').extend('Resource');

class Resource extends events.EventEmitter {
    #clip;
    #data;

    #error;
    #warn;
    #info;
    #trace;

    constructor(data,clip) {
        super();
        this.#data = data;
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
        this.#data = null;
    }

    clip() {
        return this.#clip;
    }

    data() {
        return this.#data;
    }

    id() {
        var id = this.rtype()+"/"+this.rid()
        var name = this.name();
        return id + (name? " ("+name+")":"");
    }

    rid() {
        return this.data().id;
    }

    rtype() {
        return this.data().type;
    }

    owner() {
        var result = null;

        if (this.data().owner) {
            result = this.clip().getResource(this.#data.owner.rid);
        }

        return result;
    }

    name() {
        if ((this.data().metadata) && (this.data().metadata.name))
            return this.data().metadata.name;

        if ((this.owner()) && (this.owner().name())) {
            return this.owner().name();
        }

        return null;
    }

    typeName() {
        var result = this.rtype();
        if ((this.#data.metadata) && (this.#data.metadata.control_id))
            result += this.#data.metadata.control_id;
        return result;
    }

    services() {
        this.#info("services()");
        var result = {};
        if ((this.data()) && (this.data().services))
        {
            this.data().services.forEach(service => {
                this.#trace("services()  service:",service);
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
                instance.#data[key] = event[key];
            }
        });
    }
}

module.exports = Resource;
