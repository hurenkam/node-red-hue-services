ResourceNode = require("./ResourceNode");

class ButtonNode extends ResourceNode {
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
        if ((resource) && (resource.data()) && (resource.data().button)) {
            if (resource.data().button.last_event!=null) {
                text = resource.data().button.last_event;
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = ButtonNode;
