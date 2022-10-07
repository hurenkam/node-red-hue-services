module.exports = function(RED) {
    "use strict";

    function HueDimmerSwitch(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.rid = config.rid;
        this.services = {};
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/device/" + this.rid;

        this.button = null;
        this.power_state = null;
        this.zigbee_connectivity = null;

        this.onUpdate = function(resource) {
            if ((!resource.startup) || (resource.startup === false)) {
                node.send({ payload: resource });
            }

            if (resource.type === "zigbee_connectivity") {
                node.zigbee_connectivity = resource.status;
            }

            if (resource.type === "device_power") {
                node.power_state = resource.power_state;
            }

            if (resource.type === "button") {
                node.button = resource.button;
                setTimeout(() => { 
                    node.button = null;
                    node.updateStatus();
                },10000);
            }

            node.updateStatus();
        }

        this.updateStatus = function() {
            var fill = "grey";
            var shape = "ring";
            var text = "";

            if (node.zigbee_connectivity==="connected") {
                shape = "dot";
            }

            if (node.power_state!=null) {
                if (node.power_state.battery_state === "normal") {
                    fill = "green";
                } else {
                    fill = "red";
                }
            }

            if (node.button!=null) {
                text += node.button.last_event;
            }

            if ((text === "") && (node.power_state!=null)) {
                text += node.power_state.battery_level + "%";
            }

            node.status({fill: fill, shape: shape, text: text});
        }

        setTimeout(() => {
            this.bridge.getServicesByTypeAndId("device",this.rid)
            .then(function(services) {
                services.forEach((service) => {
                    if (!node.services[service.rtype]) node.services[service.rtype]=[];
                    if (!node.services[service.rtype].includes(service.rid)) node.services[service.rtype].push(service.rid);
                    node.bridge.subscribe(service.rid,node.onUpdate);
                });
            });
        }, 5000);
    }

    RED.nodes.registerType("mh-hue-dimmer-switch",HueDimmerSwitch);
}
