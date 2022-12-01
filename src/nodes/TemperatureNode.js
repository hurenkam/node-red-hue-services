ServiceNode = require("./ServiceNode");

class TemperatureNode extends ServiceNode {
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
        super.updateStatus();

        var fill = "grey";
        var shape = "dot";
        var text = "";

        var resource = this.resource();
        if ((resource) && (resource.item()) && (resource.item().temperature)) {
            if (resource.item().temperature.temperature!=null) {
                fill = "green";
                text = ""+resource.item().temperature.temperature+"c";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = TemperatureNode;
