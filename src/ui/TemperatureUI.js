import { ServiceUI } from "./ServiceUI.js"

export class TemperatureUI extends ServiceUI {
    constructor() {
        super("Temperature","hue services","temperature");
        console.log("TemperatureUI.constructor()");

        this.config.color = "#3FADB5";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-thermometer-half";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
