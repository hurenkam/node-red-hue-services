import { DeviceUI } from "./DeviceUI.js"

export class SceneUI extends DeviceUI {
    constructor() {
        super("Scene");
        console.log("SceneUI.constructor()");

        this.config.color = "#FFAAAA";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "scene";
        this.models = null;
    }
}
