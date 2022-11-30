module.exports = function (RED) {
    /**
     * Enable http route to static ui files
     */
     RED.httpAdmin.get('/src/ui/*', function (req, res) {
        var options = {
            root: __dirname + '/src/ui/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
     });
}