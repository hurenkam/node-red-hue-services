const DeviceNode = require('./DeviceNode');

class WallSwitchModuleNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("WallSwitchModuleNode[" + config.name + "].constructor()");
        this.button = null;
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        //console.log("WallSwitchModuleNode["+this.name+"].onUpdate()");

        if (resource.type === "button") {
            this.button = resource.button;
            setTimeout(() => { 
                this.button = null;
                this.updateStatus();
            },10000);
        }

        this.updateStatus();
    }

    getStatusText() {
        var text = super.getStatusText();

        if (this.button!=null) {
            text = this.button.last_event;
        }

        return text;
    }
}

module.exports = WallSwitchModuleNode;