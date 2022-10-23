class Resource {
    constructor(RED,clip,config) {
        console.log("Resource[" + config.name + "].constructor()");
        this.config = config;
        this.clip = clip;
        RED.nodes.createNode(this,config);

        if (this.clip) {
            this.clip.once(this.config.uuid, (event) => this.onInitialUpdate(event) ); 
        }

        this.on('input', function(msg) { 
            console.log("Resource["+config.name+"].on('input')");
            this.onInput(msg); 
        });

        this.on('close', function() { 
            console.log("Resource["+config.name+"].on('close')");
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
        this.status({
            fill:  this.getStatusFill(), 
            shape: this.getStatusShape(), 
            text:  this.getStatusText()
        });
    }

    onInitialUpdate(event) {
        console.log("Resource["+this.config.name+"].onInitialUpdate(" + this.config.uuid + ")");
        console.log(event);
    }

    onUpdate(resource) {
        this.updateStatus();
    }

    onInput(msg) {
    }

    onClose() {
        this.config = null;
        this.clip = null;
    }
}

module.exports = Resource;
