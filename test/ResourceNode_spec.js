var helper = require("node-red-node-test-helper");
const TestResourceNode = require("./mocks/TestResourceNode");
const assert = require('assert');
const { mock } = require("./mocks/TestResourceNode");
const { TIMEOUT } = require("dns");

var testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    const TestResourceNode = require('./mocks/TestResourceNode');

    BaseNode.nodeAPI = RED;
    RED.nodes.registerType("ResourceNode",TestResourceNode);
}

class TestBridge {
    static mock = { }
    requestStartup(resource) {
        if (TestBridge.mock.requestStartup) {
            return TestBridge.mock.requestStartup(resource);
        }
    }
}

class TestResource {
    static mock = { }

    constructor(data) {
        this.data = data;
    }

    on(event,callback) {
        if (TestResource.mock.on) {
            return TestResource.mock.on(event,callback);
        }
    }

    rid() {
        if (TestResource.mock.rid) {
            return TestResource.mock.rid();
        }
    }

    rtype() {
        if (TestResource.mock.rtype) {
            return TestResource.mock.rtype();
        }
    }

    put(msg) {
        if (TestResource.mock.put) {
            return TestResource.mock.put(msg);
        }
    }
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

    it('should call on("update") when start() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            }
        }

        TestResource.mock = {
            on: function(event,callback) {
                assert.equal(event,'update');
                done();
            }
        }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({}));
        });
    });

    it('should call updateStatus() when start() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            },
            updateStatus: function() {
                done();
            }
        }

        TestResource.mock = { }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({}));
        });
    });

    it('should return resource provided in start(resource) call when resource() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            },
        }

        TestResource.mock = { }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({ name: "test resource" }));
            var resource = n1.resource();
            assert.equal(resource.data.name, "test resource");
            done();
        });
    });

    it('should return uuid provided in config when rid() is called', function (done) {
        var uuid = "c9f1b449-d9de-41c6-8bd4-46368eedd447";
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            uuid: uuid
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            },
        }

        TestResource.mock = { }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var rid = n1.rid();
            assert.equal(rid,uuid);
            done();
        });
    });

    // Todo:
    // - bridge()

    it('should call send() when onUpdate(event) is called', function (done) {
        var uuid = "c9f1b449-d9de-41c6-8bd4-46368eedd447";
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            wires: [["n2"]]
        },{
            id: "n2",
            type: "helper"
        }];

        TestResourceNode.mock = { }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                done();
            });
            n1.onUpdate({ name: "event" });
        });
    });

    it('should call resource.put when onInput(msg) is called and msg.rtypes contains matching type', function (done) {
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

        TestResource.mock = {
            rtype: function() { return "button" },
            put: function(msg) { done(); }
        }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({ name: "test resource" }));
            n1.receive({ rtypes: ["button"], payload: {} });
        });
    });

    it('should call resource.put when onInput(msg) is called and msg.rids contains matching rid', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
            uuid: "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8"
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            }
        }

        TestResource.mock = {
            rid: function() { return "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8" },
            put: function(msg) { done(); }
        }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({ name: "test resource" }));
            n1.receive({ rids: ["1c0fb40c-41af-4ed3-a2e0-552398dbd0d8"], payload: {} });
        });
    });

    it('should not call resource.put when onInput(msg) is called and msg.rids contains no matching rid', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
            uuid: "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8"
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            }
        }

        TestResource.mock = {
            rid: function() { return "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8" },
            put: function(msg) { assert.fail('did not expect resource.put() to be called'); }
        }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({ name: "test resource" }));
            n1.receive({ rids: ["4157244d-f3ba-4fa3-857b-b946b3d661ce"], payload: {} });
            setTimeout(() => {
                done();
            }, 0);
        });
    });

    it('should not call resource.put when onInput(msg) is called and msg.rtypes contains no matching type', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
            uuid: "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8"
        }];

        TestResourceNode.mock = {
            bridge: function () {
                return new TestBridge();
            }
        }

        TestResource.mock = {
            rtype: function() { return "button" },
            put: function(msg) { assert.fail('did not expect resource.put() to be called'); }
        }

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(new TestResource({ name: "test resource" }));
            n1.receive({ rtypes: ["light"], payload: {} });
            setTimeout(() => {
                done();
            }, 0);
        });
    });
});
