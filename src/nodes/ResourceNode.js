Resource = require("../clip/Resource");
BaseNode = require("./BaseNode");

class ResourceNode extends BaseNode {
    constructor(config,rtype=null) {
        console.log("ResourceNode[" + config.name + "].constructor()");
        super(config);
        this.config = config;
        this.rtype = rtype;

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
        console.log("ResourceNode[" + this.config.name + "].onStartup()");
        this.resource = this.clip.resources[this.config.uuid];
        this.onStartup();
    }

    onStartup() {
        console.log("ResourceNode[" + this.config.name + "].onStartup()");

        var instance = this;
        this.resource.on('update',function (event) {
            instance.onUpdate(event);
        });

        this.updateStatus();
    }

    onUpdate(event) {
        console.log("ResourceNode["+this.config.name+"].onUpdate()");
        this.send({ payload: event });
        this.updateStatus();
    }

    onInput(msg) {
        //console.log("ResourceNode[" + this.config.name + "].onInput(",msg,")");

        if (msg.rtypes) {
            if ((this.resource) && (msg.rtypes.includes(this.resource.rtype()))) {
                console.log("ResourceNode[" + this.config.name + "].onInput(",msg.payload,")");
                this.resource.put(msg.payload);
            }
        }

        if (msg.rids) {
            if ((this.resource) && (msg.rids.includes(this.resource.rid()))) {
                console.log("ResourceNode[" + this.config.name + "].onInput(",msg.payload,")");
                this.resource.put(msg.payload);
            }
        }

        super.onInput(msg);
    }

    onClose() {
        console.log("ResourceNode[" + this.config.name + "].onClose()");
        this.clip = null;
        this.config = null;
        this.rtype = null;
        super.onClose();
    }
}

module.exports = ResourceNode;
