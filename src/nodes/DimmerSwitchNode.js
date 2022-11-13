const DeviceNode = require('./DeviceNode');

class DimmerSwitchNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("DimmerSwitchNode[" + config.name + "].constructor()");
        this.button = null;
    }

    onStartup() {
        console.log("DimmerSwitchNode[" + this.config.name + "].onStarted()");

        var instance = this;
        var buttons = this.resource.getServicesByType("button");

        buttons.forEach((button) => {
            button.on('update',function(event) {
                instance.onButtonUpdate(event);
            });
        });

        super.onStartup();
    }

    onButtonUpdate(event) {
        console.log("DimmerSwitchNode[" + this.config.name + "].onButtonUpdate()");

        this.button = event.button;
        setTimeout(() => { 
            this.button = null;
            this.updateStatus();
        },10000);

        this.updateStatus();
    }

    onServicesUpdate(resource) {
        console.log("DimmerSwitchNode["+this.config.name+"].onServiceUpdate()");
        if (this.config.translate) {
            if ((resource.type == "button") && (resource.button) && (resource.button.last_event)) {
                var msg = [];
                var index = 0;

                var rids = this.resource.rids;
                while ((index < rids.length) && (rids[index] != resource.id)) {
                    if (this.config.multi) msg.push(null);
                    index += 1;
                }

                var item = this.config.buttons[index][resource.button.last_event];
                if (Object.keys(this.config.buttons[index]).includes(resource.button.last_event)) {
                    console.log("DimmerSwitchNode["+this.config.name+"].onServiceUpdate() translate buttons["+index+"][\""+resource.button.last_event+"\"]");
                    //console.log(this.config.buttons[index][resource.button.last_event]);

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

module.exports = DimmerSwitchNode;