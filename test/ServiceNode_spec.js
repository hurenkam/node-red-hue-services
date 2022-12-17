var helper = require("node-red-node-test-helper");
var testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    const ServiceNode = require('../src/nodes/ServiceNode');
    
    BaseNode.nodeAPI = RED;
    RED.nodes.registerType("ServiceNode",ServiceNode);
}

describe('Service Node', function () {
  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    //this.timeout(60000);
    var flow = [{ 
        id: "n1",
        type: "ServiceNode",
        name: "service node",
    }];

    helper.load(testnodes, flow, function () {
      var n1 = helper.getNode("n1");
      var config = n1.config;
      //console.log(config);
      config.should.have.property('name', 'service node');
      done();
    });
  });
});
