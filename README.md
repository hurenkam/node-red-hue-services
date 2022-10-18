# node-red-contrib-mh-hue
node-red palette to access hue bridge through clip v2 api

# credits
Credit where credit is due, this was inspired by the node-red-contrib-huemagic project, which stopped working for me at some point.
That is when i decided to go and dive into this, and create my own wrapper around the hue clip v2 api.
Note that the bridge discovery code in mh-hue-api.* is actually taken from that project.

I initially licensed this code under GPLv2, but have recently changed that to Apache v2 because both node-red as well asl the huemagic extension
use that license, and i want this to be compatible so that in case it might be considered usefull by either project, they can easily include it.
Since Apache v2 is less restrictive than GPLv2, it imposes no limits w.r.t. the original license, the code can still be re-distributed under GPLv2.
