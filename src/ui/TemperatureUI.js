import { ServiceUI } from "./ServiceUI.js"

export class TemperatureUI extends ServiceUI {
    constructor() {
        super("Temperature","hue services","temperature");
        console.log("TemperatureUI.constructor()");

        this.config.color = "#A8FFFF";
        this.config.icon = "font-awesome/fa-thermometer-half";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
