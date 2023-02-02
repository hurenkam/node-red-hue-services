var helper = require("node-red-node-test-helper");
const BaseNode = require('../src/nodes/BaseNode');
const ResourceNode = require("../src/nodes/ResourceNode");
const assert = require('assert');
const sinon = require('sinon');

var testnodes = function(RED) {
    "use strict";
    BaseNode.nodeAPI = RED;
    RED.nodes.registerType("ResourceNode",ResourceNode);
}

describe('Resource Node', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        helper.unload();
        sandbox.restore();
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
        const fake = sandbox.fake(() => {
            return {
                requestStartup: function(resource) {
                    done();
                }
            };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        var flow = [{ 
            id: "n1",
            type: "ResourceNode",
        }];

        helper.load(testnodes, flow, function () {
            helper.getNode("n1");
        });
    });

    it('should call on("update") when start() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        const fake = sandbox.fake(() => {
            return {
                requestStartup: function(resource) {}
            };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                    done();
                }
            });
        });
    });

    it('should call updateStatus() when start() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        const fakeRequestStartup = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        const fakeUpdateStatus = sandbox.fake(() => {
            done();
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fakeRequestStartup);
        sandbox.replace(ResourceNode.prototype,'updateStatus',fakeUpdateStatus);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                }
            });
        });
    });

    it('should call onStartup() when start() is called and startevent() returns true', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        const fakeRequestStartup = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        const fakeStartevent = sandbox.fake(() => {
            return true;
        });
        const fakeOnStartup = sandbox.fake(() => {
            done();
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fakeRequestStartup);
        sandbox.replace(ResourceNode.prototype,'startevent',fakeStartevent);
        sandbox.replace(ResourceNode.prototype,'onStartup',fakeOnStartup);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                data: function(event,callback) {
                    return { brightness: 100 };
                }
            });
        });
    });

    it('should return resource provided in start(resource) call when resource() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
        }];

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                data: function() { return { name: "test resource" } }
            });
            var resource = n1.resource();
            assert.equal(resource.data().name, "test resource");
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

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var rid = n1.rid();
            assert.equal(rid,uuid);
            done();
        });
    });

    // Todo:
    // - bridge()

    it('should call send() when onStartup(event) is called', function (done) {
        var uuid = "c9f1b449-d9de-41c6-8bd4-46368eedd447";
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            wires: [["n2"]]
        },{
            id: "n2",
            type: "helper"
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                done();
            });
            n1.onStartup({ name: "event" });
        });
    });

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

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                rtype: function() { return "button" },
                put: function(msg) { done(); }
            });
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

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                rid: function() { return "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8" },
                put: function(msg) { done(); }
            });
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

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                rid: function() { return "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8" },
                put: function(msg) { assert.fail('did not expect resource.put() to be called'); }
            });
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

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start({
                on: function(event,callback) {
                    assert.equal(event,'update');
                },
                rtype: function() { return "button" },
                put: function(msg) { assert.fail('did not expect resource.put() to be called'); }
            });
            n1.receive({ rtypes: ["light"], payload: {} });
            setTimeout(() => {
                done();
            }, 0);
        });
    });

    it('should not call resource.put when onInput(msg) is called and resource==null', function (done) {
        var flow = [{
            id: "n1",
            type: "ResourceNode",
            name: "resource node",
            uuid: "1c0fb40c-41af-4ed3-a2e0-552398dbd0d8"
        }];

        const fake = sandbox.fake(() => {
            return { requestStartup: function(resource) {} };
        });
        sandbox.replace(ResourceNode.prototype,'bridge',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.start(null);
            n1.receive({ rtypes: ["light"], payload: {} });
            setTimeout(() => {
                done();
            }, 0);
        });
    });
});
