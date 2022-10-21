module.exports = function(RED) {
    "use strict";

    const MotionSensor = require('./src/MotionSensor');

    function MotionSensorNode(config) {
        RED.nodes.createNode(this,config);
        this.base = new MotionSensor(this,config,RED.nodes.getNode(config.bridge));
        const node = this;

        this.on('input', function(msg) { 
            node.base.onInput(msg); 
        });

        this.on('close', function() { 
            node.base.onClose(); 
        });
    }

    RED.nodes.registerType("mh-hue-motion-sensor",MotionSensorNode);
}
