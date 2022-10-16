module.exports = function(RED) {
    "use strict";

    function HueMotionBehavior(config) {
        RED.nodes.createNode(this,config);
        const node = this;

        this.config = config;
        console.log("HueMotionBehavior() config:");
        console.log(config);
        this.motionTimeout = null;
        this.lightstate = { on: false, brightness: 0 }
        this.state = "idle";

        this.updateStatus = function() {
            console.log("HueMotionBehavior.updateStatus()");
            var fill = "grey";
            var shape = "ring";
            var text = "";

            if (node.state) shape = "dot";
            if (node.state === "motiondetected") fill = "blue";
            if (node.state === "lightson") fill = "yellow";
            
            node.status({fill: fill, shape: shape, text: text});
        }

        this.onMotionDetected = function() {
            console.log("HueMotionBehavior.onMotionDetected()");
            //console.log(node.config.motion);

            if (node.state != "lightson")
            {
                node.updateMotionTimeout();

                if (node.state != "motindetected")
                {
                    node.state = "motiondetected";
                    node.send(node.config.motion);
                    node.updateStatus();
                }
            }
        }

        this.updateMotionTimeout = function() {
            if (node.motionTimeout != null) {
                clearTimeout(node.motionTimeout);
            }
            var timeout = node.config.timeout * 1000;
            console.log("HueMotionBehavior.updateMotionTimeout(): " + timeout);
            node.motionTimeout = setTimeout(node.onMotionTimeout,timeout);
        }

        this.onMotionTimeout = function() {
            console.log("HueMotionBehavior.onMotionTimeout()");
            //console.log(node.config.nomotion);
            node.send(node.config.nomotion);
            node.state = "idle";
            node.updateStatus();
        }

        this.onLightsOn = function() {
            console.log("HueMotionBehavior.onLightsOn()");
            node.state = "lightson";
            node.updateStatus();
        }

        this.onLightsOff = function() {
            console.log("HueMotionBehavior.onLightsOff()");
            node.state = "idle";
            node.updateStatus();
        }

        this.on('input', function(msg) {
            //console.log("HueMotionBehavior.on('input')");
            //console.log(msg);

            if (node.state != "lightson") {
                if (msg.payload.type === "motion")
                {
                    var motion = msg.payload.motion;
        
                    if ((motion) && (motion.motion) && (motion.motion_valid)) {
                        node.onMotionDetected();
                    }
                }
            }

            if (node.state != "motiondetected") {
                if ((msg.payload.type === "light") || (msg.payload.type === "grouped_light"))
                {
                    if (msg.payload.on) {
                        if (msg.payload.on.on) {
                            node.onLightsOn();
                        } else {
                            node.onLightsOff();
                        }
                    }
                }
            }
        });
    }

    RED.nodes.registerType("mh-hue-motion-behavior",HueMotionBehavior);
}
