module.exports = function(RED) {
    "use strict";

    Resource = require("../src/Resource");

    class ZoneNode extends Resource {
        constructor(config) {
            super(RED,RED.nodes.getNode(config.bridge).clip,config,"zone");
            console.log("ZoneNode[" + config.name + "].constructor()");

            this.services = [];
            this.state = { on: false, brightness: 0 };
        }

        onInitialUpdate(event) {
            super.onInitialUpdate(event);
            console.log("ZoneNode[" + this.config.name + "].onInitialUpdate()");
            console.log(event)
    
            this.services = this.clip.getSortedDeviceServices(this.config.uuid,"zone");
            console.log(this.services)
    
            this.services.forEach((service) => {
                this.clip.on(service.rid, (event) => {
                    console.log("ZoneNode["+this.config.name+"].clip.on(" + service.rid + ")");
                    console.log(event);
                    this.onUpdate(event.resource);
                    this.updateStatus();
                });
            });
        }
    
        onUpdate(resource) {
            console.log("ZoneNode[" + this.config.name + "].onUpdate()");
            console.log(resource);

            var msg = [];
            var index = 0;

            // Find the service that matches the resource id,
            // and update index and msg accordingly
            if (this.services) {
                while ((index < this.services.length) && (this.services[index].rid != resource.id)) {
                    if (this.config.multi) msg.push(null);
                    index += 1;
                }

                // if resource id was found then send the message
                if (index < this.services.length) {
                    msg.push({ index: index, payload: resource });
                    this.send(msg);
                }
            }

            if (resource.type === "grouped_light") {
                if (resource.on) {
                    this.state.on = resource.on.on;
                }

                if (resource.dimming) {
                    this.state.brightness = resource.dimming.brightness;
                }
            }
    
            super.onUpdate(resource);
        }

        onInput(msg) {
            console.log("ZoneNode["+this.name+"].onInput()");
            console.log(msg);

            if (msg.rids)
            {
                this.services.forEach(service => {
                    if (msg.rids.includes(service.rid)) {
                        const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                        this.clip.put(url,msg.payload);
                    }
                });
            } else if (msg.rtypes) {
                this.services.forEach(service => {
                    if (msg.rtypes.includes(service.rtype)) {
                        const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                        this.clip.put(url,msg.payload);
                    }
                });
            } else {
                this.services.forEach(service => {
                    const url = "/clip/v2/resource/" + service.rtype + "/" + service.rid;
                    this.clip.put(url,msg.payload);
                });
            }

            super.onInput(msg);
        }

        getStatusFill() {
            var fill = super.getStatusFill() || "grey";
    
            if (this.state.on) {
                fill = "yellow";
            }
    
            return fill;
        }
    
        getStatusText() {
            var text = super.getStatusText();
    
            if (this.state.on) {
                text = "on";
    
                if (this.state.brightness) {
                    text += " (" + this.state.brightness + "%)";
                }
            } else {
                text = "off";
            }
    
            return text;
        }

        onClose() {
            //console.log("ZoneNode["+this.name+"].onClose()");
            this.services = null;
            super.onClose();
        }
    }

    RED.nodes.registerType("ZoneNode",ZoneNode);
}
