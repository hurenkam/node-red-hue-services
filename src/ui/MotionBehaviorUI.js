import { BaseUI } from "./BaseUI.js"

export class MotionBehaviorUI extends BaseUI {
    constructor() {
        super("Motion Behavior","hue behavior");
        console.log("MotionBehaviorUI.constructor()");

        const one_second = 1000;
        const one_minute = 60 * one_second;
        const five_minutes = 5 * one_minute;

        this.config.defaults.motion = {
            value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": true } } }"
        };
        this.config.defaults.nomotion = {
            value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": false } } }"
        };
        this.config.defaults.timeout = { value: five_minutes };
        this.config.color = "#D8BFD8";
    }

    build(config) {
        super.build(config);

        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.numberInput(template_root,"timeout","Motion timeout",config.timeout);
        this.jsonInput(template_root,"motion","On Motion",config.motion)
        this.jsonInput(template_root,"nomotion","On Timeout",config.nomotion)
    }
}
