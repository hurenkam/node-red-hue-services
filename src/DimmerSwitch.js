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

    onServicesUpdate(resource) {
        if (this.config.translate) {
            if ((resource.type == "button") && (resource.button) && (resource.button.last_event)) {
                var msg = [];
                var index = 0;

                while ((index < this.services.length) && (this.services[index].rid != resource.id)) {
                    if (this.config.multi) msg.push(null);
                    index += 1;
                }

                var item = this.config.buttons[index][resource.button.last_event];
                if (Object.keys(this.config.buttons[index]).includes(resource.button.last_event)) {
                    console.log("DimmerSwitch["+this.config.name+"].onServiceUpdate() translate buttons["+index+"][\""+resource.button.last_event+"\"]");
                    console.log(this.config.buttons[index][resource.button.last_event]);

                    if ((item != null) && (item != "")) {
                        msg.push(JSON.parse(item))
                        this.send(msg);
                    }

                    return // do not call super
                }
            }
        }
        super.onServicesUpdate(resource);
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