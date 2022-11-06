class MotionSensorUI extends DeviceUI {
    constructor() {
        super("Hue Motion Sensor");
        console.log("MotionSensorUI.constructor()");

        this.config.defaults.smart = { value: true }
        this.config.defaults.motiontimeout = { value: 10000 }
        this.config.defaults.onmotion = { value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": true } } }" }
        this.config.defaults.ontimeout = { value: "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": false } } }" }
        this.config.inputs = 1
        this.config.color = "#E6E0F8";
        this.config.icon = "font-awesome/fa-rss";

        this.models = ["SML001","SML002"];
    }

    build(config) {
        super.build(config);
        console.log("MotionSensorUI.build()");
        console.log(config);
        var template_root = document.getElementById("template-root");
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
        super.onEditPrepare(config);

        var instance = this;
        $('#input-select-smart').change(function()
        {
            instance.updateSmartOptions();
        });

        this.updateSmartOptions();
    }
}
