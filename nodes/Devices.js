module.exports = function(RED) {
    "use strict";

    const Device = require('../src/Device');
    class DeviceNode extends Device {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("DeviceNode[" + config.name + "].constructor()");
        }
    }

    const DimmerSwitch = require('../src/DimmerSwitch');
    class DimmerSwitchNode extends DimmerSwitch {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("DimmerSwitchNode[" + config.name + "].constructor()");
        }
    }

    const Light = require('../src/Light');
    class LightNode extends Light {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("LightNode[" + config.name + "].constructor()");
        }
    }

    const LutronAurora = require('../src/LutronAurora');
    class LutronAuroraNode extends LutronAurora {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("LutronAuroraNode[" + config.name + "].constructor()");
        }
    }

    const MotionSensor = require('../src/MotionSensor');
    class MotionSensorNode extends MotionSensor {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("MotionSensorNode[" + config.name + "].constructor()");
        }
    }

    const WallSwitchModule = require('../src/WallSwitchModule');
    class WallSwitchModuleNode extends WallSwitchModule {
        constructor(config) {
            super(RED, RED.nodes.getNode(config.bridge).clip, config);
            console.log("WallSwitchModuleNode[" + config.name + "].constructor()");
        }
    }

    var nodes = {
        "DeviceNode": DeviceNode,
        "DimmerSwitchNode": DimmerSwitchNode,
        "LightNode": LightNode,
        "LutronAuroraNode": LutronAuroraNode,
        "MotionSensorNode": MotionSensorNode,
        "WallSwitchModuleNode": WallSwitchModuleNode
    }

    Object.keys(nodes).forEach((id) => {
        RED.nodes.registerType(id,nodes[id]);
    });
}
