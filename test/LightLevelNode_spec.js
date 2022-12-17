const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("LightLevelNode",LightLevelNode);
}
const LightLevelNode = require('../src/nodes/LightLevelNode');
const { isNull } = require("util");

describe('LightLevelNode', function () {
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
            type: "LightLevelNode",
            name: "light level node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'light level node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(LightLevelNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "LightLevelNode",
            name: "light level node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "green/dot/12345"', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { light: { light_level: 12345 } }
            }
        });
        sandbox.replace(LightLevelNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {
            args = fakeStatus.firstArg;

            assert.equal(args.fill,"green");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"12345");

            done()
        });
        sandbox.replace(LightLevelNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "LightLevelNode",
            name: "light level node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                light: { light_level: 12345 }
            });
        });
    });

    it('should call status() with "grey/dot/" when resource==null', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(LightLevelNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(LightLevelNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "LightLevelNode",
            name: "light level node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                light: { light_level: 12345 }
            });
        });
    });

    it('should call status() with "grey/dot/" when light_level==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { light: { light_level: null } }
            }
        });
        sandbox.replace(LightLevelNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(LightLevelNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "LightLevelNode",
            name: "light level node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                light: { light_level: 12345 }
            });
        });
    });
});