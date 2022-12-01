// ====================
// Manage debug logging
// ====================

module.exports = function (RED) {

    const debug = require('debug');

    // GET: Retrieves current setting, but beware:
    //      There is a bug in the debug module where it not
    //      always accepts the same namespaces as input
    //      causing the GET sometimes to error and leave
    //      debugging disabled alltogether.
    //
    //      Use the following command to retrieve the settings:
    //      curl -i -H "Accept: application/json" 'localhost:1880/debug'
    RED.httpAdmin.get('/debug', function (req, res) {
        console.log("/debug",req.method);
        var namespaces = debug.disable();
        console.log("/debug",req.method,namespaces);
        debug.enable(namespaces);
        res.end(JSON.stringify(Object({ "namespaces": namespaces })));
    });

    // POST: Using POST you can set the debug level to a new
    //       namespaces setting.
    //       e.g. use the following command to enable error and warning logging:
    //       curl -i -H "Accept: application/json" 'localhost:1880/debug' -d "namespaces='error:*,warn:*'"
    RED.httpAdmin.post('/debug', function (req, res) {
        console.log("/debug",req.method,req.body);

        if (req.method=="POST") {
            var namespaces = req.body.namespaces;
            if (namespaces) {
                debug.enable(namespaces);
                res.end(JSON.stringify(Object({ "namespaces": namespaces })));
            } else {
                res.end(JSON.stringify(Object({ "error": "Missing namespaces in request." })));
            }
            return;
        }

        res.end(JSON.stringify(Object({ "error": "Only GET and PUT are supported." })));
    });

    // DELETE: Using DELETE you can disable the debug logging.
    //         e.g. use the following command:
    //         curl -i -H "Accept: application/json" 'localhost:1880/debug' -X "DELETE"
    RED.httpAdmin.delete('/debug', function (req, res) {
        console.log("/debug",req.method);
        var namespaces = debug.disable();
        console.log("/debug",req.method,namespaces);
        res.end(JSON.stringify(Object({ "namespaces": namespaces })));
    });
}
