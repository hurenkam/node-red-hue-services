BaseNode = require("./BaseNode");

const _error = require('debug')('error').extend('ResourceNode');
const _warn  = require('debug')('warn').extend('ResourceNode');
const _info  = require('debug')('info').extend('ResourceNode');
const _trace = require('debug')('trace').extend('ResourceNode');

class ResourceNode extends BaseNode {
    #onUpdate;
    #resource;

    #error;
    #warn;
    #info;
    #trace;

    constructor(config) {
        super(config);

        this.#error = _error.extend("["+this.logid()+"]");
        this.#warn  = _warn. extend("["+this.logid()+"]");
        this.#info  = _info. extend("["+this.logid()+"]");
        this.#trace = _trace.extend("["+this.logid()+"]");

        this.#info("constructor()");
        if (this.bridge()) {
            this.bridge().requestStartup(this);
        }
    }

    start(resource) {
        this.#info("start()");
        this.#resource = resource;

        var instance = this;
        this.#onUpdate = function(event) {
            try {
                instance.onUpdate(event);
            } catch (error) {
                this.#error(error);
            }
        }

        this.resource().on('update',this.#onUpdate);
        this.updateStatus();
    }

    destructor() {
        this.#info("destructor()");
        if (this.clipTimeout) {
            clearTimeout(this.clipTimeout);
        }

        this.removeAllListeners();
        this.#resource = null;
        super.destructor();
    }

    resource() {
        return this.#resource;
    }

    rid() {
        return this.config.uuid;
    }

    bridge() {
        return BaseNode.nodeAPI.nodes.getNode(this.config.bridge);
    }

    onUpdate(event) {
        this.#trace("onUpdate()");
        this.send({ payload: event });
    }

    onInput(msg) {
        var resource = this.resource();
        if (!resource) {
            this.#trace("onInput(): Resource not found",this.rid());
        }

        if (msg.rtypes) {
            if ((resource) && (msg.rtypes.includes(resource.rtype()))) {
                this.#trace("onInput(",msg.payload,")");
                resource.put(msg.payload);
            }
        }

        if (msg.rids) {
            if ((resource) && (msg.rids.includes(resource.rid()))) {
                this.#trace("onInput(",msg.payload,")");
                resource.put(msg.payload);
            }
        }

        super.onInput(msg);
    }
}

module.exports = ResourceNode;
