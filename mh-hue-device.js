module.exports = function(RED) {
    "use strict";

    const Base = require('./src/Base');

    function HueDevice(config) {
        RED.nodes.createNode(this,config);
        this.base = new Base(this,config,RED.nodes.getNode(config.bridge));
        const node = this;

        this.on('input', function(msg) { 
            node.base.onInput(msg); 
        });

        this.on('close', function() { 
            node.base.onClose(); 
        });
    }

    RED.nodes.registerType("mh-hue-device",HueDevice);
}
