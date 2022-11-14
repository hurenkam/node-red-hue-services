const DeviceNode = require('./DeviceNode');

class LightNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("LightNode[" + this.logid() + "].constructor()");
        this.button = null;
        this.state = { on: false, brightness: 0 };
    }

    onStartup() {
        console.log("LightNode[" + this.logid() + "].onStarted()");
        var instance = this;

        var light = this.resource.getServicesByType("light")[0];
        var group = this.resource.getServicesByType("grouped_light")[0];

        this._onLightUpdate = function(event) {
            try {
                instance.onLightUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        if (light) {
            this.onLightUpdate(light.item);
            light.on('update',this._onLightUpdate);
        }

        if (group) {
            this.onLightUpdate(group.item);
            group.on('update',this._onLightUpdate);
        }

        super.onStartup();
    }

    onClose() {
        var light = this.resource.getServicesByType("light")[0];
        var group = this.resource.getServicesByType("grouped_light")[0];
        
        if (light) {
            light.off('update',this._onLightUpdate);
            light = null;
        }

        if (group) {
            group.off('update',this._onLightUpdate);
            group = null;
        }

        super.onClose();
    }

    onLightUpdate(event) {
        console.log("LightNode[" + this.logid() + "].onLightUpdate()");

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

module.exports = LightNode;