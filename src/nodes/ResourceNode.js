Resource = require("../clip/Resource");
BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    constructor(config) {
        super(config);
        console.log("ResourceNode[" + this.logid() + "].constructor()");

        var instance = this;
        this.clip = BaseNode.nodeAPI.nodes.getNode(config.bridge).clip;
        //this.clip.on('started',() => {
        //    instance.onClipStarted();
        //});
        setTimeout(()=> {
            instance.onClipStarted();
        },5000);
    }

    onClipStarted() {
        console.log("ResourceNode[" + this.logid() + "].onStartup()");
        this.resource = this.clip.resources[this.config.uuid];
        if (!this.resource) {
            console.log("ResourceNode[" + this.logid() + "].onStartup(): Unable to lookup resource instance for uuid",this.config.uuid);
        } else {
            this.onStartup();
        }
    }

    onStartup() {
        console.log("ResourceNode[" + this.logid() + "].onStartup()");
        var instance = this;
        
        this._onUpdate = function(event) {
            try {
                instance.onUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }
        this.resource.on('update',this._onUpdate);

        this.updateStatus();
    }

    onUpdate(event) {
        console.log("ResourceNode["+this.logid()+"].onUpdate()");
        this.send({ payload: event });
    }

    onInput(msg) {
        //console.log("ResourceNode[" + this.logid() + "].onInput(",msg,")");

        if (msg.rtypes) {
            if ((this.resource) && (msg.rtypes.includes(this.resource.rtype()))) {
                console.log("ResourceNode[" + this.logid() + "].onInput(",msg.payload,")");
                this.resource.put(msg.payload);
            }
        }

        if (msg.rids) {
            if ((this.resource) && (msg.rids.includes(this.resource.rid()))) {
                console.log("ResourceNode[" + this.logid() + "].onInput(",msg.payload,")");
                this.resource.put(msg.payload);
            }
        }

        super.onInput(msg);
    }

    onClose() {
        console.log("ResourceNode[" + this.logid() + "].onClose()");
        this.clip = null;
        super.onClose();
    }
}

module.exports = ResourceNode;
