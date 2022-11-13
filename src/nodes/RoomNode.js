ServiceListNode = require("./ServiceListNode");

class RoomNode extends ServiceListNode {
    constructor(config) {
        super(config,"room");
        console.log("RoomNode[" + config.name + "].constructor()");

        this.services = [];
        this.state = { on: false, brightness: 0 };
    }

    onUpdate(resource) {
        //console.log("RoomNode[" + this.config.name + "].onUpdate()");
        //console.log(resource);

        if (resource.type === "grouped_light") {
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

module.exports = RoomNode;
