import { BaseUI } from "./BaseUI.js"

export class SceneCyclerUI extends BaseUI {
    constructor() {
        super("SceneCycler","hue behavior");
        console.log("SceneCyclerUI.constructor()");

        this.config.color = "#FFAAAA";
        this.config.inputs = 1;
        this.config.outputs = 1;
        this.config.icon = "font-awesome/fa-rotate-right";
        //this.config.button = {
        //    onclick: function() { console.log("SceneCyclerUI.onButtonClicked()"); }
        //}
    }
}
