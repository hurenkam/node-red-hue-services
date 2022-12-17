const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');
const BaseNode = require("../src/nodes/BaseNode");

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("BaseNode",BaseNode);
}

describe('Base Node', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        helper.unload();
        sandbox.restore();
    });

    it('should store config.name property', function (done) {

        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'base node');
            done();
        });
    });

    it('should call onInput(msg) when a message is presented on the input', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        var payload = { on: { on: true }};
        var msg = { payload: payload };

        const fake = sandbox.fake((msg) => { 
            msg.should.have.property('payload',payload);
            done();
        });
        sandbox.replace(BaseNode.prototype,'onInput',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.receive(msg);
        });
    });

    it('should call getStatusFill() when updateStatus() method is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fake = sandbox.fake(() => { 
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusFill',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should call getStatusText() when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fake = sandbox.fake(() => { 
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusText',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should call getStatusShape() when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fake = sandbox.fake(() => { 
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusShape',fake);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should call status() with default status when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fakeShape = sandbox.fake(() => null);
        const fakeText = sandbox.fake(() => null);
        const fakeFill = sandbox.fake(() => null);
        const fakeStatus = sandbox.fake(() => { done(); });
        sandbox.replace(BaseNode.prototype,'getStatusShape',fakeShape);
        sandbox.replace(BaseNode.prototype,'getStatusText',fakeText);
        sandbox.replace(BaseNode.prototype,'getStatusFill',fakeFill);
        sandbox.replace(BaseNode.prototype,'status',fakeStatus);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should call status() with correct status when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fakeShape = sandbox.fake(() => { return "ring" });
        const fakeText = sandbox.fake(() => { return "text" });
        const fakeFill = sandbox.fake(() => { return "green" });
        const fakeStatus = sandbox.fake((status) => {
            status.should.have.property('shape','ring');
            status.should.have.property('text','text');
            status.should.have.property('fill','green');
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusShape',fakeShape);
        sandbox.replace(BaseNode.prototype,'getStatusText',fakeText);
        sandbox.replace(BaseNode.prototype,'getStatusFill',fakeFill);
        sandbox.replace(BaseNode.prototype,'status',fakeStatus);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should default shape to "dot" when updateStatus() is called and fill is defined', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fakeShape = sandbox.fake(() => { return null });
        const fakeText = sandbox.fake(() => { return null });
        const fakeFill = sandbox.fake(() => { return "green" });
        const fakeStatus = sandbox.fake((status) => {
            status.should.have.property('shape','dot');
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusShape',fakeShape);
        sandbox.replace(BaseNode.prototype,'getStatusText',fakeText);
        sandbox.replace(BaseNode.prototype,'getStatusFill',fakeFill);
        sandbox.replace(BaseNode.prototype,'status',fakeStatus);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should default fill to "grey" when updateStatus() is called and shape is defined', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        const fakeShape = sandbox.fake(() => { return "dot" });
        const fakeText = sandbox.fake(() => { return null });
        const fakeFill = sandbox.fake(() => { return null });
        const fakeStatus = sandbox.fake((status) => {
            status.should.have.property('fill','grey');
            done();
        });
        sandbox.replace(BaseNode.prototype,'getStatusShape',fakeShape);
        sandbox.replace(BaseNode.prototype,'getStatusText',fakeText);
        sandbox.replace(BaseNode.prototype,'getStatusFill',fakeFill);
        sandbox.replace(BaseNode.prototype,'status',fakeStatus);

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.updateStatus();
        });
    });

    it('should return name if logid() is called and config.name is set', function (done) {
        var name = "base node";
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: name,
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            assert.equal(n1.logid(),name);
            done();
        });
    });

    it('should return id if logid() is called and config.name is not set', function (done) {
        var id = "n1";
        var flow = [{
            id: id,
            type: "BaseNode",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode(id);
            assert.equal(n1.logid(),id);
            done();
        });
    });
});
