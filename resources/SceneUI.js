import { ResourceUI } from "./ResourceUI.js"

export class SceneUI extends ResourceUI {
    constructor() {
        super("Scene");
        console.log("SceneUI.constructor()");

        this.config.color = "#FFAAAA";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "light.svg";

        this.rtype = "scene";
    }
}
