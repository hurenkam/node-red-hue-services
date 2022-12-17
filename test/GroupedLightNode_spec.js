const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("GroupedLightNode",GroupedLightNode);
}
const GroupedLightNode = require('../src/nodes/GroupedLightNode');
const { isNull } = require("util");

describe('GroupedLightNode', function () {
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
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'grouped light node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(GroupedLightNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "yellow/dot/90%" when on==true and brightness==90', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { on: { on: true }, dimming: { brightness: 90 } }
            }
        });
        sandbox.replace(GroupedLightNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"yellow");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"90%");

            done()
        });
        sandbox.replace(GroupedLightNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                on: { on: true }, dimming: { brightness: 90 }
            });
        });
    });

    it('should call status() with "grey/dot/off" when on==false and brightness==90', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { on: { on: false }, dimming: { brightness: 90 } }
            }
        });
        sandbox.replace(GroupedLightNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"off");

            done()
        });
        sandbox.replace(GroupedLightNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                on: { on: false }, dimming: { brightness: 90 }
            });
        });
    });

    it('should call status() with "grey/dot/" when resource==null', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(GroupedLightNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(GroupedLightNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                on: { on: true }, dimming: { brightness: 90 }
            });
        });
    });

    it('should call status() with "grey/dot/" when on==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { on: { on: null }, dimming: { brightness: 90 } }
            }
        });
        sandbox.replace(GroupedLightNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(GroupedLightNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                on: { on: true }, dimming: { brightness: 90 }
            });
        });
    });

    it('should call status() with "yellow/dot/" when dimming==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { on: { on: true }, dimming: null }
            }
        });
        sandbox.replace(GroupedLightNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {
            args = fakeStatus.firstArg;
            
            assert.equal(args.fill,"yellow");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done();
        });
        sandbox.replace(GroupedLightNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "GroupedLightNode",
            name: "grouped light node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                on: { on: true }, dimming: { brightness: 90 }
            });
        });
    });
});