class DeviceUI {
    constructor(label="Generic Device",category="hue devices") {
        console.log("DeviceUI.constructor()");

        var instance = this;
        this.config = {
            category: category,
            defaults: {
                name:      { value:"" },
                bridge:    { type: "BridgeConfigNode", required: true },
                uuid:      { value:"", required: true },
                multi:     { value: false },
                outputs:   { value: 1 },
            },
            color: "#C7E9C0",
            inputs:0,
            icon: "font-awesome/fa-circle-o",
            label: function() {
                return this.name||label;
            },
            paletteLabel: label,
            oneditprepare: function() { instance.onEditPrepare(this) },
            oneditsave:    function() { instance.onEditSave(this) },
            oneditcancel:  function() { instance.onEditCancel(this) },
        }

        this.rtype = "device";
        this.models = null;
        
        console.log(this.config)
    }

    textInput(parent,id,label,value) {
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <input type="text" id="node-input-'+ id +'" value="'+ value +'">';
        parent.appendChild(item);
    }

    checkboxInput(parent,id,label,value) {
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.innerHTML = '\
            <div style="display: inline-flex; width: calc(100% - 105px)">\
                <div id="input-select-'+ id +'" style="flex-grow: 1;">\
                    <input type="checkbox" id="node-input-'+ id +'" style="flex: 15px;"' + (value? ' checked="true"': '') + '">\
                </div>\
                <span style="width: 100%; margin-left: 10px;">\
                    '+ label +'\
                </span>\
            </div>';
        parent.appendChild(item);
    }

    selectInput(parent,id,label,value,options) {
    }

    bridgeInput(parent,id,label,value) {
/*
        input to be replaced with select element

        <div class="form-row">
            <label for="node-input-name"><i class="fa fa-tag"></i> Bridge</label>
            <div style="width: calc(100% - 105px); display: inline-flex;">
                <a id="node-input-lookup-bridge">
                    <i class="fa fa-pencil"></i>
                </a>
            </div>
        </div>
        <select id="node-input-bridge" style="flex-grow: 1;">
            <option value="_ADD_">Add new BridgeConfigNode...</option>
        </select>
*/
        this.textInput(parent,id,label,value);
    }

    uuidInput(parent,id,label,value) {
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <div style="display: inline-flex; width: calc(100% - 105px)">\
                <div id="input-select-'+ id +'" style="flex-grow: 1;">\
                    <input type="text" id="node-input-'+ id +'" style="width: 100%" value="' + value + '">\
                </div>\
                <button id="input-select-'+ id +'-search" type="button" class="red-ui-button" style="margin-left: 10px;">\
                    <i class="fa fa-search"></i>\
                </button>\
            </div>';
        parent.appendChild(item);
    }

    build(config) {
        console.log("DeviceUI.build()");
        var template_root = document.getElementById("template-root");
        if (!template_root) {
            console.log("template-root not found.")
            return;
        }

        this.textInput(template_root,"name","Name",config.name);
        this.bridgeInput(template_root,"bridge","Bridge",config.bridge);
        this.uuidInput(template_root,"uuid","UUID",config.uuid);
        this.checkboxInput(template_root,"multi","Seperate outputs",config.multi);        
    }

    inputUUID() {
        console.log("DeviceUI.inputUUID()");
    
        var current = $('#node-input-uuid').val();
        $('#input-select-uuid').empty();
        $('#input-select-uuid').append('<input type="text" id="node-input-uuid" placeholder="00000000-0000-0000-0000-000000000000" style="width: 100%" value="'+current+'" />');
    
        var button = $("#input-select-uuid-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }
    
    findUUID() {
        console.log("DeviceUI.findUUID()");
    
        var current = $('#node-input-uuid').val();
        var bridge_id = $('#node-input-bridge').val();
        //var bridge_id = $('#node-input-bridge option:selected').val();
        if(!bridge_id) { 
            console.log("DeviceUI.findUUID() invalid bridge_id:", bridge_id);
            return;
        }
    
        var bridge = RED.nodes.node(bridge_id);
        if(!bridge) { 
            console.log("DeviceUI.findUUID(): invalid bridge:", bridge);
            return;
        }
    
        // Add a notification on top of the page indicating that we are busy...
        var notification = RED.notify("Searching for Hue Dimmer Switch devices...", { type: "compact", modal: true, fixed: true });
    
        // retrieve the options list from the bridge config node
        // restrict the list to resources of given rtype and with model_id in given models list
        $.get("BridgeConfigNode/GetSortedResourceOptions", {
            type: this.rtype,
            bridge_id: bridge.id,
            models: this.models
        })
        .done( function(data) {
            var options = JSON.parse(data);
    
            if(options.length <= 0)
            {
                notification.close();
                RED.notify("No Hue Dimmer Switch devices found.", { type: "error" });
                return false;
            }
    
            $("#node-input-uuid").typedInput({
                types: [
                    {
                        value: current,
                        options: options
                    }
                ]
            });
    
            var button = $("#input-select-uuid-search");
            var icon = button.find("i");
            icon.removeClass("fa-search");
            icon.addClass("fa-pencil");
    
            // Remove the notification
            notification.close();
        })
        .fail(function()
        {
            console.log("DimmerSwitchNode.oneditprepare.findUUID(): failed");
    
            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }
        
    onEditPrepare(config) {
        console.log("DeviceUI.onEditPrepare()");
        this.build(config);

        var instance = this;
        $('#input-select-uuid-search').click(function()
        {
            if($('#input-select-uuid').find(".red-ui-typedInput-container").length > 0) {
                instance.inputUUID();
            } else {
                instance.findUUID();
            }
        });
    }

    onEditSave(config) {
        console.log("DeviceUI.onEditSave()");

        console.log(config);
        var config = this.config;
        var uuid = $('#node-input-uuid').val();
        var bridge = RED.nodes.node($('#node-input-bridge option:selected').val());
        var multi = $("#node-input-multi").prop('checked');
        if ((uuid) && (bridge))
        { 
            $.get("BridgeConfigNode/GetSortedDeviceServices", { 
                bridge_id: bridge.id, 
                uuid: uuid,
            })
            .done( function(data) {
                var services = JSON.parse(data);
                if (services.length > 0) {
                    config.outputs = services.length;
                    config.outputLabels = [];
                    if (multi) {
                        services.forEach(service => {
                            config.outputLabels.push(service.rtype);
                        });
                    } else {
                        config.outputs = 1;
                        config.outputLabels.push("output");
                    }
                }
            });
        }
    }

    onEditCancel(config) {
        console.log("DeviceUI.onEditCancel()");
    }
}
