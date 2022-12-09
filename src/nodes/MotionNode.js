ResourceNode = require("./ResourceNode");

class MotionNode extends ResourceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('MotionNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('MotionNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }

    onUpdate(event) {
        this.#trace("onUpdate(",event,")")
        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        this.#trace("updateStatus()")

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.data()) && (resource.data().motion)) {
            if (resource.data().motion.motion!=null) {
                fill = (resource.data().motion.motion==true)? "blue" : "grey";
                text = (resource.data().motion.motion==true)? "motion" : "no motion";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = MotionNode;
