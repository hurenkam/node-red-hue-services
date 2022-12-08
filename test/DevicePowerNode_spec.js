const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("DevicePowerNode",DevicePowerNode);
}
const DevicePowerNode = require('../src/nodes/DevicePowerNode');
const { isNull } = require("util");

describe('DevicePowerNode', function () {
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
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'device power node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(DevicePowerNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() when onUpdate(event) is called', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { power_state: { battery_level: 90 } }
            }
        });
        sandbox.replace(DevicePowerNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            console.log("args: ",args);
            assert.equal(args.fill,"green");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"90%");

            done()
        });
        sandbox.replace(DevicePowerNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                power_state: { battery_level: 90 }
            });
        });
    });

    it('should call status() when onUpdate(event) is called', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { power_state: { battery_level: 5 } }
            }
        });
        sandbox.replace(DevicePowerNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            console.log("args: ",args);
            assert.equal(args.fill,"red");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"5%");

            done()
        });
        sandbox.replace(DevicePowerNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                power_state: { battery_level: 5 }
            });
        });
    });

    it('should call status() twice with 3s delay when onUpdate(event) is called', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(DevicePowerNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            console.log("args: ",args);
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(DevicePowerNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                power_state: { battery_level: 90 }
            });
        });
    });

    it('should call status() twice with 3s delay when onUpdate(event) is called', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { power_state: { battery_level: null } }
            }
        });
        sandbox.replace(DevicePowerNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            console.log("args: ",args);
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(DevicePowerNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "DevicePowerNode",
            name: "device power node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                power_state: { battery_level: 90 }
            });
        });
    });
});