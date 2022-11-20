import { BaseUI } from "./BaseUI.js"

export class BridgeConfigUI extends BaseUI {
    constructor() {
        super("BridgeConfig");
        console.log("BridgeConfigUI.constructor()");

        this.config.category = 'config';
        this.config.defaults.ip =  { value:"", required: true }
        this.config.defaults.key = { value:"", required: true }
    }

    build(config) {
        super.build(config);
        console.log("BridgeConfigUI.build()");

        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.selectInput(template_root,"ip","IP",config.ip);
        this.selectInput(template_root,"key","Key",config.key);
    }
}
