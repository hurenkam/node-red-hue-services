const DeviceNode = require('./DeviceNode');

// ===================================================================
//
// State machine for smart behavior
//
// ===================================================================

class MotionState {
    constructor(sensor) {
        //console.log("MotionState.constructor()")
        this.sensor = sensor;
    }

    onClose() {
    }

    send(msg) {
        console.log("MotionState.send()",msg)
        this.sensor.send(msg);
    }

    change(state) {
        console.log("MotionState.change()",state.constructor.name);
        this.sensor.state = state;
        this.onClose();
        this.sensor.updateStatus();
    }

    onInput(msg) {
        //console.log("MotionState.onInput()",msg)

        if (msg.payload) {
            if (   (msg.payload.type == "motion")
                && (msg.payload.motion)
                && (msg.payload.motion.motion_valid == true)
                && (msg.payload.motion.motion == true)
            ) {
                this.onMotionDetected(msg);
            }

            if ( ( (msg.payload.type == "light") 
                || (msg.payload.type == "grouped_light") ) 
                && (msg.payload.on)
            ) {
                if (msg.payload.on.on == true) {
                    this.onLightsOn(msg);
                } else if (msg.payload.on.on == false) {
                    this.onLightsOff(msg);
                }
            }
       }
    }

    onMotionDetected(msg) {
        console.log("MotionState.onMotionDetected()")
    }

    onMotionTimeout(timer) {
        console.log("MotionState.onMotionTimeout()")
    }

    onLightsOn(msg) {
        console.log("MotionState.onLightsOn()")
    }

    onLightsOff(msg) {
        console.log("MotionState.onLightsOff()")
    }
}

class IdleState extends MotionState {

    constructor(sensor) {
        super(sensor);
        //console.log("IdleState.constructor()");
    }
    
    onMotionDetected(msg) {
        console.log("IdleState.onMotionDetected()");
        var instance = this;

        if (MotionState.timer != null) {
            clearTimeout(MotionState.timer);
            MotionState.timer = null;
        }

        MotionState.timer = setTimeout(() => {
            if ((instance) && (instance.sensor) && (instance.sensor.state)) {
                instance.sensor.state.onMotionTimeout(MotionState.timer);
            }
        },this.sensor.config.motiontimeout);

        this.send(JSON.parse(this.sensor.config.onmotion));
        this.change(new MotionDetectedState(this.sensor));
    }

    onLightsOn(msg) {
        console.log("IdleState.onLightsOn()");
        this.change(new LightsOnState(this.sensor));
    }
}

class MotionDetectedState extends MotionState {

    constructor(sensor) {
        super(sensor);
        //console.log("MotionDetectedState.constructor()");
    }
    
    onMotionDetected(msg) {
        console.log("MotionDetectedState.onMotionDetected()");
        var instance = this;

        if (MotionState.timer != null) {
            clearTimeout(MotionState.timer);
            MotionState.timer = null;
        }

        MotionState.timer = setTimeout(() => {
            instance.onMotionTimeout(MotionState.timer);
        },this.sensor.config.motiontimeout);
    }

    onMotionTimeout(msg) {
        console.log("MotionDetectedState.onMotionTimeout()");
        if (MotionState.timer != null) {
            clearTimeout(MotionState.timer);
            MotionState.timer = null;
        }
        this.send(JSON.parse(this.sensor.config.ontimeout));
        this.change(new IdleState(this.sensor));
    }

    onLightsOff(msg) {
        if (MotionState.motionTimeout != null) {
            clearTimeout(MotionState.motionTimeout);
        }
        this.change(new IdleState(this.sensor));
    }
}

class LightsOnState extends MotionState {
    constructor(sensor) {
        super(sensor);
        //console.log("LightsOnState.constructor()");
    }
    
    onLightsOff(msg) {
        console.log("LightsOnState.onLightsOff()");
        this.change(new IdleState(this.sensor))
    }
}

// ===================================================================
//
// Main functionality
//
// ===================================================================


class MotionSensorNode extends DeviceNode {
    constructor(config) {
        super(config);
        console.log("MotionSensorNode[" + this.logid() + "].constructor()");
        this.motion = null;
        this.temperature = null;
        this.light = null;

        if (config.smart) {
            this.state = new IdleState(this);
        }
    }

    onStartup() {
        console.log("MotionSensorNode[" + this.logid() + "].onStarted()");
        var instance = this;

        this._onTemperatureUpdate = function(event) {
            try {
                instance.onTemperatureUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        this._onLightLevelUpdate = function(event) {
            try {
                instance.onLightLevelUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        this._onMotionUpdate = function(event) {
            try {
                instance.onMotionUpdate(event);
            } catch (error) {
                console.log(error);
            }
        }

        var temperature = this.resource.getServicesByType("temperature")[0];
        var light_level = this.resource.getServicesByType("light_level")[0];
        var motion = this.resource.getServicesByType("motion")[0];        
        this.onTemperatureUpdate(temperature.item);
        this.onLightLevelUpdate(light_level.item);
        this.onMotionUpdate(motion.item);

        temperature.on('update',this._onTemperatureUpdate);
        light_level.on('update',this._onLightLevelUpdate);
        motion.on('update',this._onMotionUpdate);

        super.onStartup();
    }

    onClose() {
        if (MotionState.motionTimeout != null) {
            clearTimeout(MotionState.motionTimeout);
        }
        
        var temperature = this.resource.getServicesByType("temperature")[0];
        var light_level = this.resource.getServicesByType("light_level")[0];
        var motion = this.resource.getServicesByType("motion")[0];        

        temperature.off('update',this._onTemperatureUpdate);
        light_level.off('update',this._onLightLevelUpdate);
        motion.off('update',this._onMotionUpdate);

        if (this.state) {
            this.state.sensor = null;
            this.state.onClose();
            this.state = null;
        }

        super.onClose();
    }

    onTemperatureUpdate(event) {
        console.log("MotionSensorNode[" + this.logid() + "].onTemperatureUpdate(",event.temperature,")");
        this.temperature = event.temperature;
        this.updateStatus();
    }

    onLightLevelUpdate(event) {
        console.log("MotionSensorNode[" + this.logid() + "].onLightLevelUpdate(",event.light,")");
        this.light = event.light;
        this.updateStatus();
    }

    onMotionUpdate(event) {
        console.log("MotionSensorNode[" + this.logid() + "].onMotionUpdate(",event.motion,")");
        this.motion = event.motion;

        setTimeout(() => { 
            this.motion = null;
            this.updateStatus();
        },5000);

        this.updateStatus();
    }

    onServicesUpdate(resource) {
        if (this.config.smart) {

            // forward motion events to statemachine
            if (resource.type == "motion") {
                this.onInput({ payload: resource });
            }

            // do not call super because the statemachine
            // has already handled the event
            return;
        }

        super.onServicesUpdate(resource);
    }

    onInput(msg) {
        if (this.config.smart) {
            if (this.state) {
                this.state.onInput(msg);
            }
            return;
        }
        super.onInput(msg);
    }

    getStatusText() {
        var text = super.getStatusText();

        if (this.config.smart) {
            text = this.state.constructor.name.slice(0,-5);

            if (this.temperature!=null) {
                text += "  " + this.temperature.temperature + "c";
            }

            if (this.light!=null) {
                text += "  " + this.light.light_level;
            }
        } else {
            if ((this.motion!=null) && (this.motion.motion)) {
                text = "motion";
            } else {
                if (this.temperature!=null) {
                    text += "  " + this.temperature.temperature + "c";
                }

                if (this.light!=null) {
                    text += "  " + this.light.light_level;
                }
            }
        }
        
        return text;
    }
}

module.exports = MotionSensorNode;
