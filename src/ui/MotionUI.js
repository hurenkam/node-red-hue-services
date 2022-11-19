import { ServiceUI } from "./ServiceUI.js"

export class MotionUI extends ServiceUI {
    constructor() {
        super("Motion","hue services","motion");
        console.log("MotionUI.constructor()");

        this.config.color = "#FFC0FF";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-rss";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
