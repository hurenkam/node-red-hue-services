BaseNode = require("./BaseNode");

class MotionBehaviorNode extends BaseNode {
    constructor(config) {
        super(config);
        console.log("MotionBehaviorNode[" + config.name + "].constructor()");

        this.motionTimeout = null;
        this.lightstate = { on: false, brightness: 0 }
        this.state = "idle";
    }

    onInput(msg) {
        //console.log("MotionBehaviorNode[" + config.name + "].on('input')");
        //console.log(msg);

        if (this.state != "lightson") {
            if (msg.payload.type === "motion")
            {
                var motion = msg.payload.motion;
    
                if ((motion) && (motion.motion) && (motion.motion_valid)) {
                    this.onMotionDetected();
                }
            }
        }

        if (this.state != "motiondetected") {
            if ((msg.payload.type === "light") || (msg.payload.type === "grouped_light"))
            {
                if (msg.payload.on) {
                    if (msg.payload.on.on) {
                        this.onLightsOn();
                    } else {
                        this.onLightsOff();
                    }
                }
            }
        }

        super.onInput(msg);
    }

    updateStatus() {
        super.updateStatus();
        console.log("MotionBehaviorNode[" + this.config.name + "].updateStatus()");
        var fill = "grey";
        var shape = "ring";
        var text = "";

        if (this.state) shape = "dot";
        if (this.state === "motiondetected") fill = "blue";
        if (this.state === "lightson") fill = "yellow";
        
        this.status({fill: fill, shape: shape, text: text});
    }

    onMotionDetected() {
        console.log("MotionBehaviorNode[" + this.config.name + "].onMotionDetected()");
        //console.log(this.config.motion);

        if (this.state != "lightson")
        {
            this.updateMotionTimeout();

            if (this.state != "motindetected")
            {
                this.state = "motiondetected";
                if (this.config.motion) {
                    this.send(JSON.parse(this.config.motion));
                }
                this.updateStatus();
            }
        }
    }

    updateMotionTimeout() {
        if (this.motionTimeout != null) {
            clearTimeout(this.motionTimeout);
        }
        var timeout = this.config.timeout;
        console.log("MotionBehaviorNode[" + this.config.name + "].updateMotionTimeout(): " + timeout);
        this.motionTimeout = setTimeout(() => this.onMotionTimeout(),timeout);
    }

    onMotionTimeout() {
        console.log("MotionBehaviorNode[" + this.config.name + "].onMotionTimeout()");
        console.log(this.config.nomotion);
        if (this.config.nomotion) {
            this.send(JSON.parse(this.config.nomotion));
        }
        this.state = "idle";
        this.updateStatus();
    }

    onLightsOn() {
        console.log("MotionBehaviorNode[" + this.config.name + "].onLightsOn()");
        this.state = "lightson";
        this.updateStatus();
    }

    onLightsOff() {
        console.log("MotionBehaviorNode[" + this.config.name + "].onLightsOff()");
        this.state = "idle";
        this.updateStatus();
    }
}

module.exports = MotionBehaviorNode;
