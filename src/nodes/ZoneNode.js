ServiceListNode = require("./ServiceListNode");

class ZoneNode extends ServiceListNode {
    constructor(config) {
        super(config,"zone");
        console.log("ZoneNode[" + config.name + "].constructor()");

        this.services = [];
        this.state = { on: false, brightness: 0 };
    }

    onStartup() {
        console.log("ZoneNode[" + this.config.name + "].onStarted()");

        var instance = this;
        var light = this.resource.getServicesByType("grouped_light")[0];

        this.onLightUpdate(light.item);
        light.on('update',function(event) {
            instance.onLightUpdate(event);
        });

        super.onStartup();
    }

    onLightUpdate(event) {
        console.log("ZoneNode[" + this.config.name + "].onLightUpdate()");

        if (event.on) {
            this.state.on = event.on.on;
        }

        if (event.dimming) {
            this.state.brightness = event.dimming.brightness;
        }

        this.updateStatus();
    }

    getStatusFill() {
        var fill = super.getStatusFill() || "grey";

        if (this.state.on) {
            fill = "yellow";
        }

        return fill;
    }

    getStatusText() {
        var text = super.getStatusText();

        if (this.state.on) {
            text = "on";

            if (this.state.brightness) {
                text += " (" + this.state.brightness + "%)";
            }
        } else {
            text = "off";
        }

        return text;
    }
}

module.exports = ZoneNode;
