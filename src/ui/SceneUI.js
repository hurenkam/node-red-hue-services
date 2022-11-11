import { ResourceUI } from "./ResourceUI.js"

export class SceneUI extends ResourceUI {
    constructor() {
        super("Scene");
        console.log("SceneUI.constructor()");

        this.config.color = "#FFCCCC";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-tachometer";

        this.rtype = "scene";
    }
}
