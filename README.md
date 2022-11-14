# node-red-contrib-mh-hue
node-red palette to access hue bridge through clip v2 api

# status
(as of: 14/11/2022)
This is by far not complete, but most of the devices and functionality that i regularly use
in my home automation environment seems to work and stability is ok.

## Devices:
- Light (supports all the hue lights i own, and probably most that i don't)
- Dimmer Switch (should work for all versions, but i only tested with v1)
- Lutron Aurora (don't use it regularly, but seemed to work fine when i tested it)
- Wall Switch Module (same here, not regularly tested but seems to work fine last time i tested)

## Common used resources:
- Room: works fine
- Zone: works fine
- Scene: works fine

## Behavior nodes:
- Motion behavior:
- Scene cycler

## Todo
- Bridge discovery and automatic key generation has not yet been implemented. Currently the 
  bridge needs to be configured manually with an ip address and known key.
- Improve 'smart' modes for Switch and Motion devices
- Provide better low level support for simple resources as 'grouped_light' or 'light'.
- Improve the generic device node (which allows using as of yet unsupported devices)
- Provide a generic sevice node (to allow using as of yet unsupported services)

# Use
Using these nodes requires a bit of knowledge on the clip v2 api, as i designed this palette
to offer an easy low level interface towards clip. Some of the devices have an intelligent mode
that allow higher level use cases (motion sensor and dimmer switch). The smart behavior is not
yet finished thoug, and documentation has not even started yet.

The basic principle of the nodes is that you select the proper id on the bridge, then clip events
associated with that resource id will come out as payload, and whatever payload is piped in
will be sent as a put request to the clip interface.

The following command will for instance switch a light, room or zone on:
msg: { "rtypes": ["light", "grouped_light"], "payload": { "on": { "on": true } } }

And the following command wil set the brightness to 50%:
msg: { "rtypes": ["light", "grouped_light"], "payload": { "dimming": { "brightness": 50 } } }

Do note that to address a node, you must either provide an msg.rids array that contains the rid
of the resource you wish to address, or an msg.rtypes array that contains the rtype of the resource
you wish to address.

The Motion behavior node will combine input from all connected motion sensors, and if light/room/zone is connected to the input, it will disable motion behavior when that light/room/zone is on.
Output can be directly connected to a light/room/zone (typically the same as is connected to the input)

The Scene cycler allows you to cycle through the scenes that are connected to its output. It will
currently trigger a scene change on any incomming command, so it can be easily hooked up to a switch.

# credits
Credit where credit is due, this was inspired by the node-red-contrib-huemagic project, which stopped working for me at some point.
That is when i decided to go and dive into this, and create my own wrapper around the hue clip v2 api.

I initially licensed this code under GPLv2, but have recently changed that to Apache v2 because both node-red as well asl the huemagic extension
use that license, and i want this to be compatible so that in case it might be considered usefull by either project, they can easily include it.
Since Apache v2 is less restrictive than GPLv2, it imposes no limits w.r.t. the original license, the code can still be re-distributed under GPLv2.
