import { ResourceUI } from "./ResourceUI.js"

export class ZoneUI extends ResourceUI {
    constructor() {
        super("Zone");
        console.log("ZoneUI.constructor()");

        this.config.color = "#E7E7AE";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "zone";
    }
}
