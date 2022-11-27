import { DeviceUI } from "./DeviceUI.js"

export class DimmerSwitchUI extends DeviceUI {
    constructor() {
        super("Hue Dimmer Switch");
        console.log("DimmerSwitchUI.constructor()");

        this.config.defaults.translate = { value: true };
        this.config.defaults.buttons = { value: [ 
                { 
                    "initial_press": "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": true } } }"
                },
                { 
                    "initial_press": "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"dimming_delta\": { \"action\": \"up\", \"brightness_delta\": 25 } } }",
                    "repeat":  "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"dimming_delta\": { \"action\": \"up\", \"brightness_delta\": 25 } } }"
                },
                { 
                    "initial_press": "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"dimming_delta\": { \"action\": \"down\", \"brightness_delta\": 25 } } }",
                    "repeat":  "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"dimming_delta\": { \"action\": \"down\", \"brightness_delta\": 25 } } }"
                },
                {
                    "initial_press": "{ \"rtypes\":  [\"light\", \"grouped_light\" ], \"payload\": { \"on\": { \"on\": false } } }"
                }
            ] };
        this.config.color = "#C7E9C0";

        this.models = ["RWL020","RWL021"];
    }

    ui() {
        var text = super.ui();
        text += this.uiCheckboxInput("translate","Translate button output");

        // ==============================================================================
        // Tab Header
        // ==============================================================================
        var button_tabs_header = document.createElement("div");
        button_tabs_header.setAttribute("id","button-tabs-header");
        button_tabs_header.setAttribute("style","display: inline-flex; width: calc(100% - 105px)");
        button_tabs_header.innerHTML = '\
            <div class="form-row button-tabs-row">\
                <ul style="min-width: 600px; margin-bottom: 20px;" id="button-tabs"></ul>\
            </div>';
        text += button_tabs_header.outerHTML;

        // ==============================================================================
        // Tab Content
        // ==============================================================================
        var button_tabs_content = document.createElement("div");
        button_tabs_content.setAttribute("id","button-tabs-content");

        for (var i = 0; i < 4; i++) {
            var button_tab = document.createElement("div");
            button_tab.setAttribute("id","button"+i+"-tab-body");
            button_tab.setAttribute("style","display:none");

            ["initial_press","repeat","short_release","long_release"].forEach((item) => {
                button_tab.innerHTML += this.uiTextInput("button"+i+"-"+item,item);
            });
            button_tabs_content.innerHTML += button_tab.outerHTML;
        }
        text += button_tabs_content.outerHTML;

        return text;
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        console.log("DimmerSwitchUI.onEditPrepare()");

        for (var i = 0; i < 4; i++) {
            ["initial_press","repeat","short_release","long_release"].forEach((item) => {
                $("#node-input-button"+i+"-"+item).typedInput({
                    type:"json",
                    types:["json"],
                });
            });
        }

        // Create the button translation tabs
        // ==============================================================================
        var tabs = RED.tabs.create({
            id: "button-tabs",
            onchange: function(tab) {
                $("#button-tabs-content").children().hide();
                $("#" + tab.id).show();
            }
        });
        tabs.addTab({
            id: "button0-tab-body",
            label: "On"
        });
        tabs.addTab({
            id: "button1-tab-body",
            label: "Dim Up"
        });
        tabs.addTab({
            id: "button2-tab-body",
            label: "Dim Down"
        });
        tabs.addTab({
            id: "button3-tab-body",
            label: "Off"
        });

        tabs.activateTab("button0-tab-body");
        $("#button-tabs-content").children().hide();
        $("#button0-tab-body").show();

        $('#input-select-translate').change(function() {

            console.log("DimmerSwitchNode.oneditprepare.$('#input-select-translate').change()");
            var translate = $("#node-input-translate").prop('checked');

            if (translate==true) {
                $("#button-tabs-header").show();
                $("#button-tabs-content").show();
            } else {
                $("#button-tabs-header").hide();
                $("#button-tabs-content").hide();
            }

        });

        for (var i = 0; i < 4; i++) {
            ["initial_press","repeat","short_release","long_release"].forEach((item) => {
                if (config.buttons[i][item]) {
                    console.log("DimmerSwitchUI.onEditPrepare()  Found translation:",config.buttons[i][item]);
                    $("#node-input-button"+i+"-"+item).typedInput("value",config.buttons[i][item]);
                }
            });
        }
    }

    onEditSave(config) {
        super.onEditSave(config);
        console.log("DimmerSwitchUI.onEditSave()");

        for (var i = 0; i < 4; i++) {
            ["initial_press","repeat","short_release","long_release"].forEach((item) => {
                config.buttons[i][item] = $("#node-input-button"+i+"-"+item).val();
            });
        }
    }
}
