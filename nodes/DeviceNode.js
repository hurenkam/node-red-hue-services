module.exports = function(RED) {
    "use strict";
    
    const Device = require('../src/Device');

    class DeviceNode extends Device {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("DeviceNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("mh-hue-device",DeviceNode);
}
