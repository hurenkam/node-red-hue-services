ResourceNode = require("./ResourceNode");

class ContactNode extends ResourceNode {
    #fill;

    #info;
    #trace;

    constructor(config) {
        super(config);

        this.#info = require('debug')('info').extend('ContactNode').extend("["+this.logid()+"]");
        this.#trace = require('debug')('trace').extend('ContactNode').extend("["+this.logid()+"]");
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
        if ((resource) && (resource.data()) && (resource.data().contact_report)) {
            if (resource.data().contact_report.state!=null) {
                fill = (resource.data().contact_report.state=="contact")? "grey" : "blue";
                text = (resource.data().contact_report.state=="contact")? "closed" : "open";
            }
        }

        this.status({fill: fill, shape: shape, text: text});
    }
}

module.exports = ContactNode;
