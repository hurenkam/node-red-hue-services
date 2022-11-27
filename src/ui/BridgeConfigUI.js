import { BaseUI } from "./BaseUI.js"

export class BridgeConfigUI extends BaseUI {
    constructor() {
        super("BridgeConfig");
        console.log("BridgeConfigUI.constructor()");

        this.config.category = 'config';
        this.config.defaults.ip =  { value:"", required: true }
        this.config.defaults.key = { value:"", required: true }
    }

    ui() {
        var text = super.ui();
        text += this.uiSelectInput("ip","IP");
        text += this.uiSelectInput("key","Key");
        return text;
    }
}
