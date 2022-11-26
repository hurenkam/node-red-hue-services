module.exports = function(RED) {
    "use strict";

    const BaseNode = require('./nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    const BridgeConfigNode = require('./nodes/BridgeConfigNode');

    const DeviceNode = require('./nodes/DeviceNode');
    const DimmerSwitchNode = require('./nodes/DimmerSwitchNode');
    const LampNode = require('./nodes/LampNode');
    const LutronAuroraNode = require('./nodes/LutronAuroraNode');
    const MotionSensorNode = require('./nodes/MotionSensorNode');
    const WallSwitchModuleNode = require('./nodes/WallSwitchModuleNode');

    const ButtonNode = require('./nodes/ButtonNode');
    const DevicePowerNode = require('./nodes/DevicePowerNode');
    const GroupedLightNode = require('./nodes/GroupedLightNode');
    const LightNode = require('./nodes/LightNode');
    const LightLevelNode = require('./nodes/LightLevelNode');
    const MotionNode = require('./nodes/MotionNode');
    const RelativeRotaryNode = require('./nodes/RelativeRotaryNode');
    const TemperatureNode = require('./nodes/TemperatureNode');
    const ZigbeeConnectivityNode = require('./nodes/ZigbeeConnectivityNode');
    const ServiceNode = require('./nodes/ServiceNode');
    
    const SceneNode = require('./nodes/SceneNode');

    const MotionBehaviorNode = require('./nodes/MotionBehaviorNode');
    const SceneCyclerNode = require('./nodes/SceneCyclerNode');

    var nodes = {
        "BridgeConfigNode": BridgeConfigNode,

        "DeviceNode": DeviceNode,
        "DimmerSwitchNode": DimmerSwitchNode,
        "LampNode": LampNode,
        "LutronAuroraNode": LutronAuroraNode,
        "MotionSensorNode": MotionSensorNode,
        "WallSwitchModuleNode": WallSwitchModuleNode,

        "ButtonNode": ButtonNode,
        "DevicePowerNode": DevicePowerNode,
        "GroupedLightNode": GroupedLightNode,
        "LightNode": LightNode,
        "LightLevelNode": LightLevelNode,
        "MotionNode": MotionNode,
        "RelativeRotaryNode": RelativeRotaryNode,
        "TemperatureNode": TemperatureNode,
        "ZigbeeConnectivityNode": ZigbeeConnectivityNode,
        "ServiceNode": ServiceNode,

        "RoomNode": LampNode,
        "SceneNode": SceneNode,
        "ZoneNode": LampNode,

        "MotionBehaviorNode": MotionBehaviorNode,
        "SceneCyclerNode": SceneCyclerNode
    }

    Object.keys(nodes).forEach((id) => {
        RED.nodes.registerType(id,nodes[id]);
    });
}
