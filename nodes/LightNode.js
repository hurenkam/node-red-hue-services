module.exports = function(RED) {
    "use strict";

    const Light = require('../src/Light');

    class LightNode extends Light {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("LightNode[" + config.name + "].constructor()");
        }
    }
    
/*
    function LightNode(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.uuid = config.uuid;
        this.services = {};
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/device/" + this.uuid;

        this.button = null;
        this.power_state = null;
        this.zigbee_connectivity = null;
        this.state = { on: false, brightness: 0 };

        this.onUpdate = function(resource) {
            if ((!resource.startup) || (resource.startup === false)) {
                node.send({ payload: resource });
            }

            if (resource.type === "light") {
                if (resource.on) {
                    node.state.on = resource.on.on;
                }

                if (resource.dimming) {
                    node.state.brightness = resource.dimming.brightness;
                }
            }

            if (resource.type === "zigbee_connectivity") {
                node.zigbee_connectivity = resource.status;
            }

            if (resource.type === "device_power") {
                node.power_state = resource.power_state;
            }

            node.updateStatus();
        }

        this.updateStatus = function() {
            var fill = "grey";
            var shape = "ring";
            var text = "off";

            if (node.zigbee_connectivity==="connected") {
                shape = "dot";
            }

            if ((node.state) && (node.state.on === true)) {
                fill = "yellow"
                text = "on";

                if (node.state.brightness) {
                    text += " (" + node.state.brightness + "%)";
                }
            }

            node.status({fill: fill, shape: shape, text: text});
        }

        if (this.uuid)
        {
            setTimeout(() => {
                node.bridge.getServicesByTypeAndId("device",node.uuid)
                .then(function(services) {
                    services.forEach((service) => {
                        if (!node.services[service.rtype]) node.services[service.rtype]=[];
                        if (!node.services[service.rtype].includes(service.rid)) node.services[service.rtype].push(service.rid);
                        node.bridge.subscribe(service.rid,node.onUpdate);
                    });
                });
            }, 5000);
        }
        
        this.on('input', function(msg) {
            //console.log("HueLight.on('input'): ");
            //console.log(msg);

            if (msg.rtypes) {
                // if msg contains a list of rtypes
                // then forward the msg to all services that have a matching rtype
                for (const [key, value] of Object.entries(node.services)) {
                    const url = "/clip/v2/resource/" + key + "/" + value;
                    if (msg.rtypes.includes(key)) {
                        node.bridge.put(url,msg.payload);
                    }
                }
            }

            if (msg.rids) {
                // if msg contains a list of rids
                // then forward the msg to all services that have a matching rid
                for (const [key, value] of Object.entries(node.services)) {
                    const url = "/clip/v2/resource/" + key + "/" + value;
                    if (msg.rids.includes(value)) {
                        node.bridge.put(url,msg.payload);
                    }
                }
            }

            if (!(msg.rids) && !(msg.rtypes))
            {
                // if msg does not contain a list of rids or rtypes
                // then assume it is meant for all services registered with htis node
                for (const [key, value] of Object.entries(node.services)) {
                    const url = "/clip/v2/resource/" + key + "/" + value;
                    node.bridge.put(url,msg.payload);
                }
            }
        });
    }
*/
    RED.nodes.registerType("LightNode",LightNode);
}
