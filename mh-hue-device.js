module.exports = function(RED) {
    "use strict";

    function HueDevice(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.uuid = config.uuid;
        this.multi = config.multi;
        this.services = [];
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/device/" + this.uuid;

        this.onUpdate = function(resource) {
            if ((!resource.startup) || (resource.startup === false)) {
                var index = node.services.indexOf(resource.id);
                var msg = [{ index: index, payload: resource }];

                node.send(msg);
            }
        }

        setTimeout(() => {
            this.bridge.getServicesByTypeAndId("device",this.uuid)
            .then(function(services) {
                services.forEach((service) => {
                    if (!node.services.includes(service.rid)) node.services.push(service.rid);
                    node.bridge.subscribe(service.rid,node.onUpdate);
                });
            });
        }, 5000);
    }

    RED.nodes.registerType("mh-hue-device",HueDevice);
}
