const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("ZigbeeConnectivityNode",ZigbeeConnectivityNode);
}
const ZigbeeConnectivityNode = require('../src/nodes/ZigbeeConnectivityNode');
const { isNull } = require("util");

describe('ZigbeeConnectivityNode', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
        helper.unload();
      });
  
    it('should load', function (done) {
        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'zigbee connectivity node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "green/dot/connected"', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { status: "connected" }
            }
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"green");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"connected");

            done()
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                status: "connected"
            });
        });
    });

    it('should call status() with "red/dot/not connected"', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { status: "not connected" }
            }
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"red");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"not connected");

            done()
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                status: "connected"
            });
        });
    });

    it('should call status() with "grey/dot/" when resource==null', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(ZigbeeConnectivityNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                status: "connected"
            });
        });
    });

    it('should call status() with "grey/dot/" when status==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { status: null }
            }
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(ZigbeeConnectivityNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "ZigbeeConnectivityNode",
            name: "zigbee connectivity node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                status: "connected"
            });
        });
    });
});