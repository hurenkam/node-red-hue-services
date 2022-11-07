import { DeviceUI } from "./DeviceUI.js"

export class ZoneUI extends DeviceUI {
    constructor() {
        super("Zone");
        console.log("ZoneUI.constructor()");

        this.config.color = "#E7E7AE";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "zone";
        this.models = null;
    }
}
