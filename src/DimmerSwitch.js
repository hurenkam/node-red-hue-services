const Base = require('./Base');

class DimmerSwitch extends Base {
    constructor(node,config,bridge) {
        super(node,config,bridge);
        console.log("DimmerSwitch[" + this.name + "].constructor()");

        this.button = null;

        console.log(this);
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        console.log("DimmerSwitch["+this.name+"].onUpdate()");

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