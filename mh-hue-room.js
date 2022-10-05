module.exports = function(RED) {
    "use strict";

    function HueRoom(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.room = config.room;
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/room/" + this.room;

        this.state = { on: false, brightness: 0 };
	
        this.onUpdate = function(resource) {
            node.send({ payload: resource});
            console.log("HueRoom[].onUpdate() received event:");
            console.log(resource);

            if (resource.type === "grouped_light") {
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
        }

	this.bridge.getServices(this.url)
	.then(function(services) {
            services.forEach((service) => {
                console.log("HueRoom[]() subscribing to events for service id " + service.rid);
                node.bridge.subscribe(service.rid,node.onUpdate);
            });
	});

        this.on('input', function(msg) {
            node.bridge.put(node.url,msg.payload);
        });
    }

    RED.nodes.registerType("mh-hue-room",HueRoom);
}

