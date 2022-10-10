module.exports = function(RED) {
    "use strict";

    function HueGroup(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.group = config.group;
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/grouped_light/" + this.group;

        this.state = { on: false, brightness: 0 };
	
        this.onUpdate = function(resource) {
            if ((!resource.startup) || (resource.startup === false)) {
                node.send({ payload: resource });
            }

            if (resource.on) {
                node.state.on = resource.on.on;
            }

            if (resource.dimming) {
                node.state.brightness = resource.dimming.brightness;
            }

            if (node.state.on === true) {
                node.status({fill: "yellow", shape: "dot", text: "on (" + node.state.brightness + "%)"});
            } else {
                node.status({fill: "grey", shape: "dot", text: "off"});
            }
        }
        this.bridge.subscribe(this.group,this.onUpdate);

        this.on('input', function(msg) {
            node.bridge.request(node.url,"PUT",msg.payload);
        });
    }

    RED.nodes.registerType("mh-hue-grouped-light",HueGroup);
}

