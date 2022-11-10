import { DeviceUI } from "./DeviceUI.js"

export class WallSwitchModuleUI extends DeviceUI {
    constructor() {
        super("Hue Wall Switch Module");
        console.log("WallSwitchModuleUI.constructor()");

        this.config.color = "#C7E9C0";

        this.models = ["RDM001","RDM004"];
    }
}
