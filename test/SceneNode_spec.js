var helper = require("node-red-node-test-helper");
var testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    const SceneNode = require('../src/nodes/SceneNode');
    
    BaseNode.nodeAPI = RED;
    RED.nodes.registerType("SceneNode",SceneNode);
}

describe('Scene Node', function () {
  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    //this.timeout(60000);
    var flow = [{ 
        id: "n1",
        type: "SceneNode",
        name: "scene node",
    }];

    helper.load(testnodes, flow, function () {
      var n1 = helper.getNode("n1");
      var config = n1.config;
      //console.log(config);
      config.should.have.property('name', 'scene node');
      done();
    });
  });
});
