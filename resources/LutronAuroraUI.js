import { DeviceUI } from "./DeviceUI.js"

export class LutronAuroraUI extends DeviceUI {
    constructor() {
        super("Lutron Aurora Dimmer Switch");
        console.log("LutronAuroraUI.constructor()");

        this.models = ["Z3-1BRL"];
    }
}
