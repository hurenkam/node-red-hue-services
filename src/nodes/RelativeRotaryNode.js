ServiceNode = require("./ServiceNode");

class RelativeRotaryNode extends ServiceNode {
    constructor(config) {
        super(config);
        console.log("RelativeRotaryNode[" + this.logid() + "].constructor()");

        this.fill = "grey";
    }

    onUpdate(event) {
        this.fill = "blue";
        
        var instance = this;
        setTimeout(()=>{
            instance.fill = "grey";
            instance.updateStatus();
        },1000);

        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        super.updateStatus();

        var fill = this.fill;
        var shape = "dot";
        var text = "";

        var resource = this.getResource(this.config.uuid);
        if (resource.item.relative_rotary) {
            if (resource.item.relative_rotary.last_event!=null) {
                var event = resource.item.relative_rotary.last_event;
                text = event.action + " ";
                if (event.rotation) {
                    text += (event.rotation.direction == "clock_wise")? ">> " : "<< ";
                    text += event.rotation.duration + " | " + event.rotation.steps;
                }
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = RelativeRotaryNode;
