const Device = require('./Device');

class DimmerSwitch extends Device {
    constructor(RED,clip,config) {
        super(RED,clip,config);
        console.log("DimmerSwitch[" + config.name + "].constructor()");
        this.button = null;
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        //console.log("DimmerSwitch["+this.name+"].onUpdate()");

        if (resource.type === "button") {
            this.button = resource.button;
            setTimeout(() => { 
                this.button = null;
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

        return text;
    }
}

module.exports = DimmerSwitch;