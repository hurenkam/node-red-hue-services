import { ServiceUI } from "./ServiceUI.js"

export class DevicePowerUI extends ServiceUI {
    constructor() {
        super("BatteryLevel","hue services","device_power");
        console.log("DevicePowerUI.constructor()");

        this.config.color = "#FFD8D8";
        this.config.icon = "font-awesome/fa-battery-three-quarters";
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        $('#node-container-rtype').hide();
    }
}
