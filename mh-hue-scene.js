module.exports = function(RED) {
    "use strict";

    function HueScene(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.name = config.name;
        this.uuid = config.uuid;
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/scene/" + this.uuid;

        this.onUpdate = function(resource) {
            console.log("HueScene["+ node.name +"].onUpdate() resource:");
            console.log(resource);

            if ((!resource.startup) || (resource.startup === false)) {
                node.send({ payload: resource });
            }
        }
        this.bridge.subscribe(this.light,this.onUpdate);

        this.on('input', function(msg) {
            console.log("HueScene["+ node.name +"].on('input') msg.payload:");
            console.log(msg.payload);
            node.bridge.put(node.url,msg.payload);
        });
    }

    RED.nodes.registerType("mh-hue-scene",HueScene);
}

