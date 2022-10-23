module.exports = function(RED) {
    "use strict";

    const MotionSensor = require('./src/MotionSensor');

    class MotionSensorNode extends MotionSensor {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("MotionSensorNode[" + config.name + "].constructor()");
        }
    }

    RED.nodes.registerType("mh-hue-motion-sensor",MotionSensorNode);
}
