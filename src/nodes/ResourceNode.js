Resource = require("../clip/Resource");
BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    #onUpdate;
    #resource;

    constructor(config) {
        super(config);
        console.log("ResourceNode[" + this.logid() + "].constructor()");
        this.getClip(this).requestStartup(this);
    }

    start(resource) {
        console.log("ResourceNode[" + this.logid() + "].start()");
        this.#resource = resource;

        var instance = this;
        this.#onUpdate = function(event) {
            try {
                instance.onUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        this.#resource.on('update',this.#onUpdate);
        this.updateStatus();
    }

    destructor() {
        console.log("ResourceNode[" + this.logid() + "].destructor()");
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

    getClip(caller) {
        return BaseNode.nodeAPI.nodes.getNode(this.config.bridge).getClip(caller);
    }

    onUpdate(event) {
        //console.log("ResourceNode["+this.logid()+"].onUpdate()");
        this.send({ payload: event });
    }

    onInput(msg) {
        //console.log("ResourceNode[" + this.logid() + "].onInput(",msg,")",this.config);
        var resource = this.#resource;
        if (!resource) {
            console.log("ResourceNode[" + this.logid() + "].onInput(): Resource not found",this.config.uuid);
        }

        if (msg.rtypes) {
            if ((resource) && (msg.rtypes.includes(resource.rtype()))) {
                console.log("ResourceNode[" + this.logid() + "].onInput(",msg.payload,")");
                resource.put(msg.payload);
            }
        }

        if (msg.rids) {
            if ((resource) && (msg.rids.includes(resource.rid()))) {
                console.log("ResourceNode[" + this.logid() + "].onInput(",msg.payload,")");
                resource.put(msg.payload);
            }
        }

        super.onInput(msg);
    }
}

module.exports = ResourceNode;
