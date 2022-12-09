const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("TemperatureNode",TemperatureNode);
}
const TemperatureNode = require('../src/nodes/TemperatureNode');
const { isNull } = require("util");

describe('TemperatureNode', function () {
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
            type: "TemperatureNode",
            name: "temperature node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'temperature node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(TemperatureNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "TemperatureNode",
            name: "temperature node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "green/dot/25c"', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { temperature: { temperature: 25 } }
            }
        });
        sandbox.replace(TemperatureNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {
            args = fakeStatus.firstArg;
            assert.equal(args.fill,"green");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"25c");

            done()
        });
        sandbox.replace(TemperatureNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "TemperatureNode",
            name: "temperature node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                temperature: { temperature: 25 }
            });
        });
    });

    it('should call status() with "green/dot/" when resource==null', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(TemperatureNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(TemperatureNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "TemperatureNode",
            name: "temperature node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                temperature: { temperature: 25 }
            });
        });
    });

    it('should call status() with "green/dot/" when temperature==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { temperature: { temperature: null } }
            }
        });
        sandbox.replace(TemperatureNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(TemperatureNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "TemperatureNode",
            name: "temperature node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                temperature: { temperature: 25 }
            });
        });
    });
});