const DeviceNode = require('./DeviceNode');

class WallSwitchModuleNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("WallSwitchModuleNode[" + config.name + "].constructor()");
        this.button = null;
    }

    onStartup() {
        console.log("WallSwitchModuleNode[" + this.config.name + "].onStarted()");

        var instance = this;
        var buttons = this.resource.getServicesByType("button");

        buttons.forEach((button) => {
            button.on('update',function(event) {
                instance.onButtonUpdate(event);
            });
        });

        super.onStartup();
    }

    onButtonUpdate(event) {
        console.log("WallSwitchModuleNode[" + this.config.name + "].onButtonUpdate()");

        this.button = event.button;
        setTimeout(() => { 
            this.button = null;
            this.updateStatus();
        },10000);

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