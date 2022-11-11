class BaseNode {
    static nodeAPI = null;

    constructor(config) {
        console.log("BaseNode[" + config.name + "].constructor()");
        this.config = config;
        BaseNode.nodeAPI.nodes.createNode(this,config);

        this.on('input', function(msg) { 
            //console.log("BaseNode["+config.name+"].on('input')");
            this.onInput(msg); 
        });

        this.on('close', function() { 
            //console.log("BaseNode["+config.name+"].on('close')");
            this.onClose(); 
        });
    }

    getStatusFill() {
        return null;
    }

    getStatusText() {
        return null;
    }

    getStatusShape() {
        return null;
    }

    updateStatus() {
        var fill =  this.getStatusFill();
        var shape = this.getStatusShape();
        var text =  this.getStatusText();

        if ((shape) && (!fill)) fill = "grey";
        if ((fill) && (!shape)) shape = "dot";

        this.status({
            fill:  fill,
            shape: shape,
            text:  text
        });
    }

    onInput(msg) {
        //console.log("BaseNode[" + config.name + "].onInput(",msg,")");
    }

    onClose() {
        console.log("BaseNode[" + config.name + "].onClose()");
        this.config = null;
    }
}

module.exports = BaseNode;
