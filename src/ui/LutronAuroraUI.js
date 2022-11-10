import { DeviceUI } from "./DeviceUI.js"

export class LutronAuroraUI extends DeviceUI {
    constructor() {
        super("Lutron Aurora Dimmer Switch");
        console.log("LutronAuroraUI.constructor()");

        this.config.color = "#C7E9C0";
        this.config.icon = "font-awesome/fa-circle-o";
        
        this.models = ["Z3-1BRL"];
    }
}
