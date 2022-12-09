const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("ButtonNode",ButtonNode);
}
const ButtonNode = require('../src/nodes/ButtonNode')

describe('ButtonNode', function () {
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
            type: "ButtonNode",
            name: "button node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'button node');
            done();
        });
    });

    it('should call updateStatus() twice with 3s delay when onUpdate(event) is called', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            if (statuscount++ > 0) {
                done()
            }
        });
        sandbox.replace(ButtonNode.prototype,'updateStatus',fakeStatus);

        var flow = [{
            id: "n1",
            type: "ButtonNode",
            name: "button node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "blue/dot/last_event" and "grey/dot/last_event"', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"last_event");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"last_event");
                done()
            }
        });
        sandbox.replace(ButtonNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { button: { last_event: "last_event" } }
                }
            }
        });
        sandbox.replace(ButtonNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "ButtonNode",
            name: "button node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                button: { last_event: "last_event" }
            });
        });
    });

    it('should call status() with "blue/dot/" and "grey/dot/" when resource==null', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"");
                done()
            }
        });
        sandbox.replace(ButtonNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return null
        });
        sandbox.replace(ButtonNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "ButtonNode",
            name: "button node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                button: { last_event: "last_event" }
            });
        });
    });

    it('should call status() with "blue/dot/" and "grey/dot/" when last_event==null', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"");
                done()
            }
        });
        sandbox.replace(ButtonNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { button: { last_event: null } }
                }
            }
        });
        sandbox.replace(ButtonNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "ButtonNode",
            name: "button node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                button: { last_event: "last_event" }
            });
        });
    });
});