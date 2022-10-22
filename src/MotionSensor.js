const Device = require('./Device');

class MotionSensor extends Device {
    constructor(node,config,bridge) {
        super(node,config,bridge);
        console.log("MotionSensor[" + this.name + "].constructor()");

        this.motion = null;
        this.temperature = null;
        this.light = null;

        console.log(this);
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        console.log("MotionSensor["+this.name+"].onUpdate()");

        if (resource.type === "temperature") {
            this.temperature = resource.temperature;
        }

        if (resource.type === "light_level") {
            this.light = resource.light;
        }

        if (resource.type === "motion") {
            this.motion = resource.motion;
            setTimeout(() => { 
                this.motion = null;
                this.updateStatus();
            },5000);
        }

        this.updateStatus();
    }

    getStatusText() {
        var text = super.getStatusText();

        if ((this.motion!=null) && (this.motion.motion)) {
            text = "motion";
        } else {
            if (this.temperature!=null) {
                text += this.temperature.temperature + "c  ";
            }

            if (this.light!=null) {
                text += this.light.light_level;
            }
        }

        return text;
    }
}

module.exports = MotionSensor;
