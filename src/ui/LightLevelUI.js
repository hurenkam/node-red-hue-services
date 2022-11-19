import { ServiceUI } from "./ServiceUI.js"

export class LightLevelUI extends ServiceUI {
    constructor() {
        super("Brightness","hue services","light_level");
        console.log("LightLevelUI.constructor()");

        this.config.color = "#FFFFC0";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-sun-o";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
