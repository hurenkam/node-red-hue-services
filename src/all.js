module.exports = function(RED) {
    "use strict";

    const BaseNode = require('./nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    const BridgeConfigNode = require('./nodes/BridgeConfigNode');

    const DeviceNode = require('./nodes/DeviceNode');
    const DimmerSwitchNode = require('./nodes/DimmerSwitchNode');
    const LightNode = require('./nodes/LightNode');
    const LutronAuroraNode = require('./nodes/LutronAuroraNode');
    const MotionSensorNode = require('./nodes/MotionSensorNode');
    const WallSwitchModuleNode = require('./nodes/WallSwitchModuleNode');

    const RoomNode = require('./nodes/RoomNode');
    const SceneNode = require('./nodes/SceneNode');
    const ZoneNode = require('./nodes/ZoneNode');

    const MotionBehaviorNode = require('./nodes/MotionBehaviorNode');
    const SceneCyclerNode = require('./nodes/SceneCyclerNode');

    var nodes = {
        "BridgeConfigNode": BridgeConfigNode,

        "DeviceNode": DeviceNode,
        "DimmerSwitchNode": DimmerSwitchNode,
        "LightNode": LightNode,
        "LutronAuroraNode": LutronAuroraNode,
        "MotionSensorNode": MotionSensorNode,
        "WallSwitchModuleNode": WallSwitchModuleNode,

        "RoomNode": RoomNode,
        "SceneNode": SceneNode,
        "ZoneNode": ZoneNode,

        "MotionBehaviorNode": MotionBehaviorNode,
        "SceneCyclerNode": SceneCyclerNode
    }

    Object.keys(nodes).forEach((id) => {
        RED.nodes.registerType(id,nodes[id]);
    });
}
