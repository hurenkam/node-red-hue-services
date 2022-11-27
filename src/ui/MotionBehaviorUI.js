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
        this.config.icon = "font-awesome/fa-industry";
    }

    ui() {
        var text = super.ui();
        text += this.uiNumberInput("timeout","Motion timeout");
        text += this.uiTextInput("motion","On Motion");
        text += this.uiTextInput("nomotion","On Timeout");
        return text;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);

        $("#node-input-motion").typedInput({
            type:"json",
            types:["json"]
        });

        $("#node-input-nomotion").typedInput({
            type:"json",
            types:["json"]
        });
    }
}
