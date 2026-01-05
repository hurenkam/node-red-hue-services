const base = require("@hurenkam/node-red-hue-base");
const ResourceNode = base.ResourceNode;

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

        var fill = this.#fill;
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.data()) && (resource.data().relative_rotary)) {
            if (resource.data().relative_rotary.last_event!=null) {
                var event = resource.data().relative_rotary.last_event;
                text = event.action;
                if (event.rotation) {
                    text += (event.rotation.direction == "clock_wise")? " >> " : " << ";
                    text += event.rotation.duration + " | " + event.rotation.steps;
                }
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = RelativeRotaryNode;
