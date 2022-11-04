class DimmerSwitchUI extends DeviceUI {
    constructor() {
        super("Hue Dimmer Switch");
        console.log("DimmerSwitchUI.constructor()");

        this.config.defaults.translate = { value: false };
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

        this.models = ["RWL020","RWL021"];
    }

    build(config) {
        super.build(config)
        console.log("DimmerSwitchUI.build()");

        var template_root = document.getElementById("template-root");
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }
        
        //=============================================
        // Translate button output
        //=============================================
        var translate = document.createElement("div");
        translate.setAttribute("class","form-row");
        translate.innerHTML = '\
            <div style="display: inline-flex; width: calc(100% - 105px)">\
                <div id="input-select-translate" style="flex-grow: 1;">\
                    <input type="checkbox" id="node-input-translate" style="flex: 15px;"' + (config.translate? ' checked="true"': '') + '">\
                </div>\
                <span style="width: 100%; margin-left: 10px;">\
                    Translate button output\
                </span>\
            </div>';
        template_root.appendChild(translate);

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

        template_root.appendChild(button_tabs_header);


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
                var button_tab_event = document.createElement("div");
                button_tab_event.setAttribute("class","form-row");

                var button_tab_event_label = document.createElement("label");
                button_tab_event_label.setAttribute("for","node-input-button"+i+"-"+item);

                var button_tab_event_label_content = document.createElement("i");
                button_tab_event_label_content.setAttribute("class","fa fa-tab");

                button_tab_event_label.appendChild(button_tab_event_label_content);
                button_tab_event_label.append(item)
                button_tab_event.appendChild(button_tab_event_label);

                var button_tab_event_input = document.createElement("input");
                button_tab_event_input.setAttribute("id","node-input-button"+i+"-"+item);
                button_tab_event_input.setAttribute("type","text");
                button_tab_event_input.setAttribute("placeholder","");
                button_tab_event.appendChild(button_tab_event_input);

                button_tab.appendChild(button_tab_event);
            });

            button_tabs_content.appendChild(button_tab);
        }
        template_root.appendChild(button_tabs_content);

        //var translate = $("#node-input-translate").prop('checked');
        if (config.translate==true) {
            $("#button-tabs-header").show();
            $("#button-tabs-content").show();
        } else {
            $("#button-tabs-header").hide();
            $("#button-tabs-content").hide();
        }
    }

    onEditPrepare(config) {
        super.onEditPrepare(config);
        console.log("DimmerSwitchUI.onEditPrepare()");

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

        // Set the button translation input fields to json type
        // ==============================================================================
        for (var i = 0; i < 4; i++) {
            ["initial_press","repeat","short_release","long_release"].forEach((item) => {
                $("#node-input-button"+i+"-"+item).typedInput({
                    type:"json",
                    types:["json"]
                });
                $("#node-input-button"+i+"-"+item).typedInput("value",config.buttons[i][item]);
            });
        }

        $('#input-select-translate').change(function()
        {
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
