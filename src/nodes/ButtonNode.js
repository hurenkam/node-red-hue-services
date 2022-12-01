ServiceNode = require("./ServiceNode");

class ButtonNode extends ServiceNode {
    #fill;

    #info;
    #trace;

    constructor(config) {
        super(config);

        this.#info = require('debug')('info').extend('ButtonNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('ButtonNode').extend("["+this.logid()+"]");
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
        },3000);

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
        if ((resource) && (resource.item()) && (resource.item().button)) {
            if (resource.item().button.last_event!=null) {
                text = resource.item().button.last_event;
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = ButtonNode;
