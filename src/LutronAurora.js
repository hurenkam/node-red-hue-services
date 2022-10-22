const Device = require('./Device');

class LutronAurora extends Device {
    constructor(node,config,bridge) {
        super(node,config,bridge);
        console.log("LutronAurora[" + this.name + "].constructor()");

        this.button = null;
        this.relative_rotary = null;

        console.log(this);
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        //console.log("LutronAurora["+this.name+"].onUpdate()");

        if (resource.type === "button") {
            this.button = resource.button;
            setTimeout(() => { 
                this.button = null;
                this.updateStatus();
            },10000);
        }

        if (resource.type === "relative_rotary") {
            this.relative_rotary = resource.relative_rotary;
            setTimeout(() => { 
                this.relative_rotary = null;
                this.updateStatus();
            },10000);
        }

        this.updateStatus();
    }

    getStatusText() {
        var text = super.getStatusText();

        if (this.button!=null) {
            text = this.button.last_event;
        }

        if ((this.relative_rotary!=null) && (this.relative_rotary.last_event != null) && (this.relative_rotary.last_event.rotation != null)) {
            if (this.relative_rotary.last_event.rotation.direction === "clock_wise") {
                text = ">> ";
            } else {
                text = "<< ";
            }

            text += this.relative_rotary.last_event.rotation.duration + ":" + this.relative_rotary.last_event.rotation.steps;
        }

        return text;
    }
}

module.exports = LutronAurora;