module.exports = function(RED) {
    "use strict";

    const BaseNode = require('./nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    const BridgeConfigNode = require('./nodes/BridgeConfigNode');

    const ButtonNode = require('./nodes/ButtonNode');
    const DevicePowerNode = require('./nodes/DevicePowerNode');
    const GroupedLightNode = require('./nodes/GroupedLightNode');
    const LightNode = require('./nodes/LightNode');
    const LightLevelNode = require('./nodes/LightLevelNode');
    const MotionNode = require('./nodes/MotionNode');
    const RelativeRotaryNode = require('./nodes/RelativeRotaryNode');
    const TemperatureNode = require('./nodes/TemperatureNode');
    const SceneNode = require('./nodes/SceneNode');
    const ServiceNode = require('./nodes/ServiceNode');
    const ZigbeeConnectivityNode = require('./nodes/ZigbeeConnectivityNode');
    

    var nodes = {
        "BridgeConfigNode": BridgeConfigNode,

        "ButtonNode": ButtonNode,
        "DevicePowerNode": DevicePowerNode,
        "GroupedLightNode": GroupedLightNode,
        "LightNode": LightNode,
        "LightLevelNode": LightLevelNode,
        "MotionNode": MotionNode,
        "RelativeRotaryNode": RelativeRotaryNode,
        "SceneNode": SceneNode,
        "ServiceNode": ServiceNode,
        "TemperatureNode": TemperatureNode,
        "ZigbeeConnectivityNode": ZigbeeConnectivityNode,
    }

    Object.keys(nodes).forEach((id) => {
        RED.nodes.registerType(id,nodes[id]);
    });
}
