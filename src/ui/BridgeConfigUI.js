import { BaseUI } from "./BaseUI.js"

export class BridgeConfigUI extends BaseUI {
    constructor() {
        super("BridgeConfig","config");
        console.log("BridgeConfigUI.constructor()");

        this.config.defaults.ip =  { value:"", required: true }
        this.config.defaults.key = { value:"", required: true }
    }

    ui() {
        var text = super.ui();
        text += this.uiSelectInput("ip","IP");
        text += this.uiSelectInput("key","Key");
        return text;
    }

    selectText(id) {
        //console.log("BridgeConfigUI.selectText()");

        var current = $('#node-config-input-'+id).val();
        $('#input-select-'+id).empty();
        $('#input-select-'+id).append('<input type="text" id="node-config-input-'+id+'" style="width: 100%" value="'+current+'" />');

        var button = $("#input-select-"+id+"-search");
        var icon = button.find("i");
        icon.removeClass("fa-pencil");
        icon.addClass("fa-search");
    }

    selectIp() {
        //console.log("BridgeConfigUI.selectIp()");
        var current = $('#node-config-input-ip').val();
        var notification = RED.notify("Searching for bridges...", {
            type: "compact", modal: true, fixed: true
        });

        $.get("/BridgeConfigNode/DiscoverBridges",{})
        .done( function(data) {
            var options = JSON.parse(data);

            if(options.length <= 0)
            {
                notification.close();
                RED.notify("No options found.", { type: "error" });
                return false;
            }

            $("#node-config-input-ip").typedInput({
                types: [
                    {
                        value: current,
                        options: options
                    }
                ]
            });

            var button = $("#input-select-ip-search");
            var icon = button.find("i");
            icon.removeClass("fa-search");
            icon.addClass("fa-pencil");

            // Remove the notification
            notification.close();
        })
        .fail(function()
        {
            console.log("ResourceUI.selectOption(): failed");

            // Remove the notification
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    acquireKey() {
        //console.log("BridgeConfigUI.aquireKey()");
        var ip = $('#node-config-input-ip').val();
        var key = $('#node-config-input-key').val();
        if (!ip) {
            console.log("BridgeConfigUI.acquireKey(): no ip address selected");
            return;
        }

        var notification = RED.notify("Press the button on the bridge...", {
            type: "compact", modal: true, fixed: true
        });

        $.get("/BridgeConfigNode/AcquireApplicationKey",{ ip: ip })
        .done( function(response) {
            var data = JSON.parse(response);
            //console.log("BridgeConfigUI.acquireKey()",data);
            notification.close();
            if (Object.keys(data).includes("key")) {
                $('#node-config-input-key').val(data.key);
            } else {
                RED.notify(data.error.description, "error");
            }
        })
        .fail(function()
        {
            notification.close();
            RED.notify("unknown error", "error");
        });
    }

    onEditPrepare(config) {
        //console.log("BridgeConfigUI.onEditPrepare()");
        var instance = this;

        $('#input-select-ip-search').click(function()
        {
            if($('#input-select-ip').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("ip");
            } else {
                instance.selectIp();
            }
        });

        $('#input-select-key-search').click(function()
        {
            if($('#input-select-key').find(".red-ui-typedInput-container").length > 0) {
                instance.selectText("key");
            } else {
                instance.acquireKey();
            }
        });
    }
}
