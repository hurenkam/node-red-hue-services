ServiceNode = require("./ServiceNode");

class MotionNode extends ServiceNode {
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
        super.updateStatus();

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.item()) && (resource.item().motion)) {
            if (resource.item().motion.motion!=null) {
                fill = (resource.item().motion.motion==true)? "blue" : "grey";
                text = (resource.item().motion.motion==true)? "motion" : "no motion";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = MotionNode;
