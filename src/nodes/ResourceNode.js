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
        if (resource==null)
            return;

        this.#info("start()");
        this.#resource = resource;

        var instance = this;
        this.#onUpdate = function(event) {
            instance.onUpdate(event);
        }

        if (this.startevent()==true) {
            this.onStartup(resource.data())
        }

        this.resource().on('update',this.#onUpdate);
        this.updateStatus();
    }

    destructor() {
        this.#info("destructor()");
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

    startevent() {
        return this.config.startevent;
    }

    bridge() {
        return BaseNode.nodeAPI.nodes.getNode(this.config.bridge);
    }

    onStartup(event) {
        this.#trace("onStartup()");
        this.send({ payload: event });
    }

    onUpdate(event) {
        this.#trace("onUpdate()");
        this.send({ payload: event });
    }

    onInput(msg) {
        super.onInput(msg);

        var resource = this.resource();
        if (!resource) {
            this.#trace("onInput(): Resource not found",this.rid());
            return;
        }

        if (msg.rtypes && msg.rtypes.includes(resource.rtype())) {
            resource.put(msg.payload).then(result => { 
                return; 
            }, info => {
                var error = info.error;
                var request = info.request; 
                this.error("ResourceNode::onInput() request: "+JSON.stringify(request)+" error: " + error);
                return; 
            });
        }

        if (msg.rids && msg.rids.includes(resource.rid())) {
            resource.put(msg.payload).then(result => { 
                return; 
            }, info => {
                var error = info.error;
                var request = info.request; 
                this.error("ResourceNode::onInput() request: "+JSON.stringify(request)+" error: " + error);
                return; 
            });
        }
    }
}

module.exports = ResourceNode;
