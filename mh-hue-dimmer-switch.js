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

        this.onUpdate = function(resource) {
            node.send({ payload: resource });
        }

        this.bridge.getServices(this.url)
        .then(function(services) {
            services.forEach((service) => {
                if (!node.services[service.rtype]) node.services[service.rtype]=[];
                if (!node.services[service.rtype].includes(service.rid)) node.services[service.rtype].push(service.rid);
                node.bridge.subscribe(service.rid,node.onUpdate);
            });
        });
    }

    RED.nodes.registerType("mh-hue-dimmer-switch",HueDimmerSwitch);
}
