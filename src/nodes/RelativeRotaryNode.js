ResourceNode = require("./ResourceNode");

class RelativeRotaryNode extends ResourceNode {
    #fill;

    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('RelativeRotaryNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('RelativeRotaryNode').extend("["+this.logid()+"]");
        this.#info("constructor()");

        this.#fill = "grey";
    }

    onUpdate(event) {
        this.#trace("onUpdate(",event,")");
        this.#fill = "blue";
        
        var instance = this;
        setTimeout(()=>{
            instance.#fill = "grey";
            instance.updateStatus();
        },1000);

        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        this.#trace("updateStatus()");
        super.updateStatus();

        var fill = this.#fill;
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.item()) && (resource.item().relative_rotary)) {
            if (resource.item().relative_rotary.last_event!=null) {
                var event = resource.item().relative_rotary.last_event;
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
