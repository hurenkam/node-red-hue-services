module.exports = function (RED) {

    const debug = require('debug');

    // Manage debug logging
    RED.httpAdmin.get('/debug', function (req, res) {
        console.log("/debug",req.method);
        var namespaces = debug.disable();
        console.log("/debug",req.method,namespaces);
        debug.enable(namespaces);
        res.end(JSON.stringify(Object({ "namespaces": namespaces })));
    });

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

    RED.httpAdmin.delete('/debug', function (req, res) {
        console.log("/debug",req.method);
        var namespaces = debug.disable();
        console.log("/debug",req.method,namespaces);
        res.end(JSON.stringify(Object({ "namespaces": namespaces })));
    });
}