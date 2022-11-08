import { DeviceUI } from "./DeviceUI.js"

export class MotionSensorUI extends DeviceUI {
    constructor() {
        super("Hue Motion Sensor");
        console.log("MotionSensorUI.constructor()");

        const one_second = 1000;
        const one_minute = 60 * one_second;
        const five_minutes = 5 * one_minute;

        this.config.defaults.smart = { value: true }
        this.config.defaults.motiontimeout = { value: five_minutes }
        this.config.defaults.onmotion = { value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": true } } }" }
        this.config.defaults.ontimeout = { value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": false } } }" }
        this.config.defaults.inputs = { value: 1 };
        this.config.defaults.outputs = { value: 1 };
        this.config.color = "#E6E0F8";
        this.config.icon = "font-awesome/fa-rss";

        this.models = ["SML001","SML002"];
    }

    build(config) {
        super.build(config);
        console.log("MotionSensorUI.build()");
        
        var template_root = this.getTemplateRoot();
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.checkboxInput(template_root,"smart","Smart mode",config.smart);        
        this.numberInput(template_root,"motiontimeout","Motion timeout",config.motiontimeout);
        this.jsonInput(template_root,"onmotion","On Motion",config.onmotion)
        this.jsonInput(template_root,"ontimeout","On Timeout",config.ontimeout)
    }

    updateSmartOptions() {
        console.log("MotionSensorUI.updateSmartOptions()");
        var smart = $("#node-input-smart").prop('checked');

        if (smart==true) {
            $("#node-container-motiontimeout").show();
            $("#node-container-onmotion").show();
            $("#node-container-ontimeout").show();
        } else {
            $("#node-container-motiontimeout").hide();
            $("#node-container-onmotion").hide();
            $("#node-container-ontimeout").hide();
        }
    }

    onEditPrepare(config) {
        console.log("MotionSensorUI.onEditPrepare()");
        super.onEditPrepare(config);

        var instance = this;
        $('#input-select-smart').change(function()
        {
            instance.updateSmartOptions();
        });

        this.updateSmartOptions();
    }

    onEditSave(config) {
        console.log("MotionSensorUI.onEditSave()");
        //console.log(config);

        var smart = $("#node-input-smart").prop('checked');
        if (smart==true) {
            config.inputs = 1;
        } else {
            config.inputs = 0;
        }

        super.onEditSave(config);
     }
}
