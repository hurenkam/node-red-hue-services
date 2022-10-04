module.exports = function(RED) {
    "use strict";

    function HueLight(config) {
        RED.nodes.createNode(this,config);
	const node = this;

	this.name = config.name;
	this.light = config.light;
        this.bridge = RED.nodes.getNode(config.bridge);
        this.url = "/clip/v2/resource/light/" + this.light;

        this.onUpdate = function(resource) {
            node.send({ payload: resource});
        }
	this.bridge.subscribe(this.light,this.onUpdate);

        this.on('input', function(msg) {
            node.bridge.put(node.url,msg.payload);
        });
    }

    RED.nodes.registerType("mh-hue-light",HueLight);
}

