const helper = require("node-red-node-test-helper");
const assert = require('assert');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    const TestBaseNode = require('./mocks/TestBaseNode');
    RED.nodes.registerType("BaseNode",TestBaseNode);
}

describe('Base Node', function () {
    afterEach(function () {
        helper.unload();
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

        helper.load(testnodes, flow, function () {
            var payload = { on: { on: true }};
            var msg = { payload: payload };

            var n1 = helper.getNode("n1");
            n1.reportInput = function(msg) {
                msg.should.have.property('payload',payload);
                done();
            };

            n1.receive(msg);
        });
    });

    it('should call getStatusFill() when updateStatus() method is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.returnStatusFill = function() {
                done();
            };
            n1.updateStatus();
        });
    });

    it('should call getStatusText() when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.returnStatusText = function() {
                done();
            };
            n1.updateStatus();
        });
    });

    it('should call getStatusShape() when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.returnStatusShape = function() {
                done();
            };
            n1.updateStatus();
        });
    });

    it('should call status() with default status when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.reportStatus = function(status) {
                status.should.have.property('shape',null);
                status.should.have.property('text',null);
                status.should.have.property('fill',null);
                done();
            };
            n1.updateStatus();
        });
    });

    it('should call status() with correct status when updateStatus() is called', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");

            n1.returnStatusShape = function() {
                return "ring";
            };
            n1.returnStatusText = function() {
                return "text";
            };
            n1.returnStatusFill = function() {
                return "green";
            };
            n1.reportStatus = function(status) {
                status.should.have.property('shape','ring');
                status.should.have.property('text','text');
                status.should.have.property('fill','green');
                done();
            };

            n1.updateStatus();
        });
    });

    it('should default shape to "dot" when updateStatus() is called and fill is defined', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");

            n1.returnStatusFill = function() {
                return "green";
            };
            n1.reportStatus = function(status) {
                status.should.have.property('shape','dot');
                done();
            };

            n1.updateStatus();
        });
    });

    it('should default fill to "grey" when updateStatus() is called and shape is defined', function (done) {
        var flow = [{
            id: "n1",
            type: "BaseNode",
            name: "base node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");

            n1.returnStatusShape = function() {
                return "dot";
            };
            n1.reportStatus = function(status) {
                status.should.have.property('fill','grey');
                done();
            };

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
            var logid = n1.logid();
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
            var logid = n1.logid();
            assert.equal(n1.logid(),id);
            done();
        });
    });
});
