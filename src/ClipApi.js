const events = require('events');
const EventSource = require('eventsource');
const RestApi = require('./RestApi');

class ClipApi extends events.EventEmitter {
    constructor(name,ip,key) {
        super();
        this._name = name;
        console.log("ClipApi["+this._name+"].constructor()");
        this._rest = new RestApi(name,ip,500,{"hue-application-key": key});

        var sseURL = "https://" + ip + "/eventstream/clip/v2";
        this._eventsource = new EventSource(sseURL, {
            headers: { 'hue-application-key': key },
            https: { rejectUnauthorized: false },
        });
        this._eventsource.onmessage = (event) => this._onStreamEvent(event);
    
        this._servicesByTypeAndId = {};
        this.updateDevicesAndServices();        
    }

    _onStreamEvent(event) {
        const messages = JSON.parse(event.data);
        messages.forEach((message) => {
            message.data.forEach((item) => {
                this.emit(item.id, { update: "partial", resource: item });
                //console.log({ update: "partial", resource: item });
            });
        });
    }

    updateDevicesAndServices() {
        console.log("ClipApi[" + this._name + "].updateDevicesAndServices()");
        const local = this;

        this._rest.get("/clip/v2/resource")
        .then(function (response) {
            response.data.forEach((item) => {
                if (!Object.keys(local._servicesByTypeAndId).includes(item.type)) {
                    local._servicesByTypeAndId[item.type] = {};
                }
                local._servicesByTypeAndId[item.type][item.id] = item;
                local.emit(item.id, { update: "full", resource: item });
                //console.log({ update: "full", resource: item });
            });
        });
    }

    getResource(rtype,rid) {
        return this._servicesByTypeAndId[rtype][rid];
    }

    getSortedServices(rtype,rid) {
        return this._servicesByTypeAndId[rtype][rid];
    }
}

module.exports = ClipApi;
