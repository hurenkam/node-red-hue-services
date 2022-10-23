const Device = require('./Device');

class WallSwitchModule extends Device {
    constructor(RED,clip,config) {
        super(RED,clip,config);
        console.log("WallSwitchModule[" + config.name + "].constructor()");
        this.button = null;
    }

    onUpdate(resource) {
        super.onUpdate(resource);
        //console.log("WallSwitchModule["+this.name+"].onUpdate()");

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

module.exports = WallSwitchModule;