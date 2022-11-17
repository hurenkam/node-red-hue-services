const DeviceNode = require('./DeviceNode');

class DimmerSwitchNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("DimmerSwitchNode[" + this.logid() + "].constructor()");
        this.button = null;
    }

    onStartup() {
        console.log("DimmerSwitchNode[" + this.logid() + "].onStarted()");

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
        console.log("DimmerSwitchNode[" + this.logid() + "].onButtonUpdate()");

        this.button = event.button;
        setTimeout(() => { 
            this.button = null;
            this.updateStatus();
        },10000);

        this.updateStatus();
    }

    onServicesUpdate(resource) {
        //console.log("DimmerSwitchNode["+this.logid()+"].onServiceUpdate() resource.id:", resource.id);
        if (this.config.translate) {
            if ((resource.type == "button") && (resource.button) && (resource.button.last_event)) {
                var msg = [];
                var index = 0;
                var button = 0;

                var services = this.clip.getSortedServicesById(this.config.uuid);
                if (services) {
        
                    // Find the service that matches the resource id,
                    // and update index and msg accordingly
                    while ((index < services.length) && (services[index].rid() != resource.id)) {
                        if (this.config.multi) msg.push(null);
                        if (services[index].rtype() == "button") {
                            button += 1;
                        }
                        index += 1;
                    }

                    var item = this.config.buttons[button][resource.button.last_event];
                    if (Object.keys(this.config.buttons[button]).includes(resource.button.last_event)) {
                        //console.log("DimmerSwitchNode["+this.logid()+"].onServiceUpdate() translate buttons["+index+"][\""+resource.button.last_event+"\"]");

                        if ((item != null) && (item != "")) {
                            msg.push(JSON.parse(item))
                            this.send(msg);
                        }

                        return // do not call super
                    }
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