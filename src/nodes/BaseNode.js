class BaseNode {
    static nodeAPI = null;

    constructor(config) {
        this.config = config;
        console.log("BaseNode[" + this.logid() + "].constructor()");
        BaseNode.nodeAPI.nodes.createNode(this,config);

        this.on('input', function(msg) { 
            //console.log("BaseNode["+this.id()+"].on('input')");
            this.onInput(msg); 
        });

        this.on('close', function() { 
            //console.log("BaseNode["+this.id()+"].on('close')");
            this.onClose(); 
        });
    }

    logid() {
        return ((this.config) && (this.config.name))? this.config.name: "<?>";
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
        //console.log("BaseNode[" + this.logid() + "].onInput(",msg,")");
    }

    onClose() {
        console.log("BaseNode[" + this.logid() + "].onClose()");
        this.config = null;
    }
}

module.exports = BaseNode;
