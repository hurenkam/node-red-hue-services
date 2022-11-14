const DeviceNode = require('./DeviceNode');

class LutronAuroraNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("LutronAuroraNode[" + this.logid() + "].constructor()");
        this.button = null;
        this.relative_rotary = null;
    }

    onStartup() {
        console.log("LutronAuroraNode[" + this.logid() + "].onStarted()");
        var instance = this;

        var buttons = this.resource.getServicesByType("button");
        buttons.forEach((button) => {
            button.on('update',function(event) {
                instance.onButtonUpdate(event);
            });
        });

        var rotary = this.resource.getServicesByType("relative_rotary")[0];
        rotary.on('update',function(event) {
            instance.onRotaryUpdate(event);
        });

        super.onStartup();
    }

    onButtonUpdate(event) {
        console.log("LutronAuroraNode[" + this.logid() + "].onButtonUpdate()");

        this.button = event.button;
        setTimeout(() => { 
            this.button = null;
            this.updateStatus();
        },10000);

        this.updateStatus();
    }

    onRotaryUpdate(event) {
        console.log("LutronAuroraNode[" + this.logid() + "].onRotaryUpdate()");

        this.relative_rotary = event.relative_rotary;
        setTimeout(() => { 
            this.relative_rotary = null;
            this.updateStatus();
        },10000);

        this.updateStatus();
    }
    
    getStatusText() {
        var text = super.getStatusText();

        if (this.button!=null) {
            text = this.button.last_event;
        }

        if ((this.relative_rotary!=null) && (this.relative_rotary.last_event != null) && (this.relative_rotary.last_event.rotation != null)) {
            if (this.relative_rotary.last_event.rotation.direction === "clock_wise") {
                text = ">> ";
            } else {
                text = "<< ";
            }

            text += this.relative_rotary.last_event.rotation.duration + ":" + this.relative_rotary.last_event.rotation.steps;
        }

        return text;
    }
}

module.exports = LutronAuroraNode;