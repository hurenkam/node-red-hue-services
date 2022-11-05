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
        console.log("DeviceUI.textInput("+id+")");
        var item = document.createElement("div");
        item.setAttribute("class","form-row");
        item.innerHTML = '\
            <label for="node-input-'+ id +'"><i class="fa fa-tag"></i> '+ label +'</label>\
            <input type="text" id="node-input-'+ id +'" value="'+ value +'">';
        parent.appendChild(item);
    }

    checkboxInput(parent,id,label,value) {
        console.log("DeviceUI.checkboxInput("+id+")");
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

    selectInput(parent,id,label,value) {
        console.log("DeviceUI.selectInput("+id+")");
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
        this.selectInput(template_root,"bridge","Bridge",config.bridge);
        this.selectInput(template_root,"uuid","UUID",config.uuid);
        this.checkboxInput(template_root,"multi","Seperate outputs",config.multi);        
    }

    selectText(id) {
        console.log("DeviceUI.selectText()");
    
        var current = $('#node-input-'+id).val();
        $('#input-select-'+id).empty();
        $('#input-select-'+id).append('<input type="text" id="node-input-'+id+'" style="width: 100%" value="'+current+'" />');
    
        var button = $("#input-select-"+id+"-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }

    selectOption(id,url,data) {
        console.log("DeviceUI.selectOption()");
        var current = $('#node-input-'+id).val();
        var notification = RED.notify("Searching for options...", { 
            type: "compact", modal: true, fixed: true 
        });

        $.get(url, data)
        .done( function(data) {
            var options = JSON.parse(data);
    
            if(options.length <= 0)
            {
                notification.close();
                RED.notify("No options found.", { type: "error" });
                return false;
            }
    
            $("#node-input-"+id).typedInput({
                types: [
                    {
                        value: current,
                        options: options
                    }
                ]
            });
    
            var button = $("#input-select-"+id+"-search");
            var icon = button.find("i");
            icon.removeClass("fa-search");
            icon.addClass("fa-pencil");
    
            // Remove the notification
            notification.close();
        })
        .fail(function()
        {
            console.log("DeviceUI.selectOption(): failed");
    
            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    selectResource() {
        console.log("DeviceUI.selectResource()");
        var bridge_id = $('#node-input-bridge').val();
        if(!bridge_id) { 
            console.log("DeviceUI.selectResource() invalid bridge_id:", bridge_id);
            return;
        }

        var bridge = RED.nodes.node(bridge_id);
        if(!bridge) { 
            console.log("DeviceUI.selectResource(): invalid bridge:", bridge);
            return;
        }

        this.selectOption(
            "uuid",
            "BridgeConfigNode/GetSortedResourceOptions",
            {
                type: this.rtype,
                bridge_id: bridge.id,
                models: this.models
            }
        );
    }

    selectBridge() {
        console.log("DeviceUI.selectBridge()");
        this.selectOption(
            "bridge",
            "BridgeConfigNode/GetBridgeOptions",
            {}
        );
    }
        
    onEditPrepare(config) {
        console.log("DeviceUI.onEditPrepare()");
        this.build(config);

        var instance = this;
        $('#input-select-bridge-search').click(function()
        {
            if($('#input-select-bridge').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("bridge");
            } else {
                instance.selectBridge();
            }
        });
        instance.selectBridge();

        $('#input-select-uuid-search').click(function()
        {
            if($('#input-select-uuid').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("uuid");
            } else {
                instance.selectResource();
            }
        });
        instance.selectResource();
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
