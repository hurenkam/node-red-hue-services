var helper = require("node-red-node-test-helper");
const TestResourceNode = require("./mocks/TestResourceNode");

var testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    const TestResourceNode = require('./mocks/TestResourceNode');

    BaseNode.nodeAPI = RED;
    RED.nodes.registerType("ResourceNode",TestResourceNode);
}

describe('Resource Node', function () {
    afterEach(function () {
      helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ 
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var config = n1.config;
            config.should.have.property('name', 'resource node');
            done();
        });
    });

    it('should call bridge.requestStartup on construction', function (done) {
        class TestBridge {
            requestStartup(resource) {
                //console.log("TestBridge.requestStartup()",resource);
                done();
            }
        }

        var flow = [{ 
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
        }];

        TestResourceNode.mock = { 
            bridge: function () {
                return new TestBridge();
            }
        }

        helper.load(testnodes, flow, function () {
            helper.getNode("n1");
        });
    });
});
