const DeviceNode = require('./DeviceNode');

class LightNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("LightNode[" + config.name + "].constructor()");
        this.button = null;
        this.state = { on: false, brightness: 0 };
    }

    onUpdate(resource) {
        //console.log("LightNode["+this.name+"].onUpdate()");

        if (resource.type === "light") {
            if (resource.on) {
                this.state.on = resource.on.on;
            }

            if (resource.dimming) {
                this.state.brightness = resource.dimming.brightness;
            }
        }

        super.onUpdate(resource);
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

module.exports = LightNode;