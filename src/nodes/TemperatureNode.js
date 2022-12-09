ResourceNode = require("./ResourceNode");

class TemperatureNode extends ResourceNode {
    #info;
    #trace;

    constructor(config) {
        super(config);
        this.#info = require('debug')('info').extend('TemperatureNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('TemperatureNode').extend("["+this.logid()+"]");
        this.#info("constructor()");
    }

    onUpdate(event) {
        this.#trace("onUpdate(",event,")");
        this.updateStatus();
        super.onUpdate(event);
    }

    updateStatus() {
        this.#trace("updateStatus()");

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.data()) && (resource.data().temperature)) {
            if (resource.data().temperature.temperature!=null) {
                fill = "green";
                text = ""+resource.data().temperature.temperature+"c";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = TemperatureNode;
