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

                if (node.multi) {
                    for (let i = 0; i < index; i++) {
                        msg.unshift(null);
                    }
                }
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

        this.on('input', function(msg) {

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

    RED.nodes.registerType("mh-hue-device",HueDevice);
}
