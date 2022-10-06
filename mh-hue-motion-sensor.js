module.exports = function(RED) {
    "use strict";

    function HueMotionSensor(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.sensor = config.sensor;
        this.services = {};
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/device/" + this.sensor;

        this.state = { on: false, brightness: 0 };
	
        this.onUpdate = function(resource) {
            node.send({ payload: resource });
        }

        this.bridge.getServices(this.url)
        .then(function(services) {
            services.forEach((service) => {
                if (!node.services[service.rtype]) node.services[service.rtype]=[];
                node.services[service.rtype].push(service.rid);
                node.bridge.subscribe(service.rid,node.onUpdate);
            });
        });
    }

    RED.nodes.registerType("mh-hue-motion-sensor",HueMotionSensor);
}
