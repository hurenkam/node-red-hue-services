module.exports = function(RED) {
    "use strict";

    var info = require('debug')('info').extend('node-red-hue-services').extend('all.js');

    const ButtonNode = require('./nodes/ButtonNode');
    const CameraMotionNode = require('./nodes/CameraMotionNode');
    const ContactNode = require('./nodes/ContactNode');
    const DevicePowerNode = require('./nodes/DevicePowerNode');
    const GroupedLightNode = require('./nodes/GroupedLightNode');
    const LightNode = require('./nodes/LightNode');
    const LightLevelNode = require('./nodes/LightLevelNode');
    const MotionNode = require('./nodes/MotionNode');
    const RelativeRotaryNode = require('./nodes/RelativeRotaryNode');
    const TemperatureNode = require('./nodes/TemperatureNode');
    const SceneNode = require('./nodes/SceneNode');
    const ZigbeeConnectivityNode = require('./nodes/ZigbeeConnectivityNode');
    

    var nodes = {
        "ButtonNode": ButtonNode,
        "CameraMotionNode": CameraMotionNode,
        "ContactNode": ContactNode,
        "DevicePowerNode": DevicePowerNode,
        "GroupedLightNode": GroupedLightNode,
        "LightNode": LightNode,
        "LightLevelNode": LightLevelNode,
        "MotionNode": MotionNode,
        "RelativeRotaryNode": RelativeRotaryNode,
        "SceneNode": SceneNode,
        "TemperatureNode": TemperatureNode,
        "ZigbeeConnectivityNode": ZigbeeConnectivityNode,
    }

    Object.keys(nodes).forEach((id) => {
        var typeName = "@hurenkam/node-red-hue-services/"+id
        info("registerType:",typeName);
        RED.nodes.registerType(typeName,nodes[id]);
    });
}
