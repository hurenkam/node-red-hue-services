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
                var msg = [];
                var index = 0;

                // Find the service that matches the resource id,
                // and update index and msg accordingly
                while ((index < node.services.length) && (node.services[index].rid != resource.id))
                {
                    if (node.multi) msg.push(null);
                    index += 1;
                }

                // if resource id was found then send the message
                if (index < node.services.length) {
                    msg.push({ index: index, payload: resource });
                    node.send(msg);
                }
            }
        }

        this.on('input', function(msg) {
            if (msg.rids) {
                // if msg contains a list of rids
                // then forward the msg to all services that have a matching rid
                node.services.forEach(service => {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    if (msg.rids.includes(service.rid)) {
                        node.bridge.put(url,msg.payload);
                    }
                });
            } else if (msg.rtypes) {
                // else if msg contains a list of rtypes
                // then forward the msg to all services that have a matching rtype
                node.services.forEach(service => {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    if (msg.rtypes.includes(service.rtype)) {
                        node.bridge.put(url,msg.payload);
                    }
                });
            } else {
                // if msg does not contain a list of rids or rtypes
                // then assume it is meant for all services
                node.services.forEach(service => {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    node.bridge.put(url,msg.payload);
                });
            }
        });

        // allow the api some time to startup
        // then subscribe to events for each service of this device
        setTimeout(() => {
            node.services = node.bridge.getSortedDeviceServices(node.uuid);
            node.services.forEach(service => {
                node.bridge.subscribe(service.rid,node.onUpdate);
            });
        }, 5000);
    }

    RED.nodes.registerType("mh-hue-device",HueDevice);
}
