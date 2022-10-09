module.exports = function(RED) {
    "use strict";

    function HueMotionSensor(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.uuid = config.uuid;
        this.services = {};
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/device/" + this.uuid;

        this.motion = null;
        this.temperature = null;
        this.light = null;
        this.power_state = null;
        this.zigbee_connection = null;

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

            if (resource.type === "temperature") {
                node.temperature = resource.temperature;
            }

            if (resource.type === "light_level") {
                node.light = resource.light;
            }

            if (resource.type === "motion") {
                node.motion = resource.motion;
                setTimeout(() => { 
                    node.motion = null;
                    node.updateStatus();
                },5000);
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

            if ((text === "") && (node.power_state!=null)) {
                text += node.power_state.battery_level + "%  ";

                if (node.temperature!=null) {
                    text += node.temperature.temperature + "c  ";
                }

                if (node.light!=null) {
                    text += node.light.light_level;
                }
            }

            if ((node.motion!=null) && (node.motion.motion)) {
                text = "motion"
            }

            node.status({fill: fill, shape: shape, text: text});
        }

        setTimeout(() => { 
            this.bridge.getServicesByTypeAndId("device",this.uuid)
            .then(function(services) {
                services.forEach((service) => {
                    if (!node.services[service.rtype]) node.services[service.rtype]=[];
                    if (!node.services[service.rtype].includes(service.rid)) node.services[service.rtype].push(service.rid);
                    node.bridge.subscribe(service.rid,node.onUpdate);
                });
            }); 
        }, 5000); 
    }

    RED.nodes.registerType("mh-hue-motion-sensor",HueMotionSensor);
}
