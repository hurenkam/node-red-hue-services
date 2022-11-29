Resource = require("../clip/Resource");
BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    #onUpdate;
    #onStartup;

    constructor(config) {
        super(config);
        console.log("ResourceNode[" + this.logid() + "].constructor()");

        var instance = this;
        this.#onStartup = async function() {
            instance.onStartup();
        }

        this.getClip(this).on('started',this.#onStartup);
    }

    getClip(caller) {
        return BaseNode.nodeAPI.nodes.getNode(this.config.bridge).getClip(caller);
    }

    getResource(uuid) {
        return this.getClip(this).getResource(uuid);
    }

    onStartup() {
        console.log("ResourceNode[" + this.logid() + "].onStartup()");
        var instance = this;
        
        this.#onUpdate = function(event) {
            try {
                instance.onUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }
        var resource = this.getResource(this.config.uuid);
        if (resource) {
            resource.on('update',this.#onUpdate);
        } else {
            console.log("ResourceNode["+this.logid()+"].onStartup(): Resource not found",this.config.uuid);
        }
        this.updateStatus();
    }

    onUpdate(event) {
        //console.log("ResourceNode["+this.logid()+"].onUpdate()");
        this.send({ payload: event });
    }

    onInput(msg) {
        //console.log("ResourceNode[" + this.logid() + "].onInput(",msg,")",this.config);
        var resource = this.getResource(this.config.uuid);
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

    destructor() {
        console.log("ResourceNode[" + this.logid() + "].destructor()");
        if (this.clipTimeout) {
            clearTimeout(this.clipTimeout);
        }

        super.destructor();
        this.removeAllListeners();
    }
}

module.exports = ResourceNode;
