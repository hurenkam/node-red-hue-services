module.exports = function(RED) {
    "use strict";

    function HueRoom(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.room = config.room;
        this.services = {};
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/room/" + this.room;

        this.state = { on: false, brightness: 0 };
	
        this.onUpdate = function(resource) {
            node.send({ payload: resource });

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
                    if (!node.services[service.rtype]) node.services[service.rtype]=[];
                    node.services[service.rtype].push(service.rid);
                    node.bridge.subscribe(service.rid,node.onUpdate);
                });
            });

        this.on('input', function(msg) {
            if (msg.service) {
                if ( (msg.service.rtype) && (node.services[msg.service.rtype]) ) {
                    if ( (msg.service.rid) && (node.services[msg.service.rtype].includes(msg.service.rid))) {

                        // if msg contains rtype and rid, then address the specific service
                        const url = "/clip/v2/resource/" + msg.service.rtype + "/" + msg.service.rid;
                        node.bridge.put(url,msg.payload);

                    } else {

                        // otherwise address all services of rtype associated with this node
                        node.services[msg.service.rtype].forEach((rid) => {
                            const url = "/clip/v2/resource/" + msg.service.rtype + "/" + rid;
                            node.bridge.put(url,msg.payload);
                        });

                    }
                }
            } else {

                // if msg does not contain a service identifier, then assume it is meant for all
                // services registered with this node
                for (const [key, value] of Object.entries(node.services)) {
                    const url = "/clip/v2/resource/" + key + "/" + value;
                    node.bridge.put(url,msg.payload);
                }

            }
        });
    }

    RED.nodes.registerType("mh-hue-room",HueRoom);
}
