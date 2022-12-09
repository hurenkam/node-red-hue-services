const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("MotionNode",MotionNode);
}
const MotionNode = require('../src/nodes/MotionNode');
const { isNull } = require("util");

describe('MotionNode', function () {
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
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'motion node');
            done();
        });
    });

    it('should call updateStatus() when onUpdate(event) is called', function (done) {
        const fakeStatus = sandbox.fake(() => {
            done()
        });
        sandbox.replace(MotionNode.prototype,'updateStatus',fakeStatus);
    
        var flow = [{
            id: "n1",
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "blue/dot/motion" when motion==true', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { motion: { motion: true } }
            }
        });
        sandbox.replace(MotionNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"blue");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"motion");

            done()
        });
        sandbox.replace(MotionNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                motion: { motion: true }
            });
        });
    });

    it('should call status() with "blue/dot/no motion" when motion==false', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { motion: { motion: false } }
            }
        });
        sandbox.replace(MotionNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"no motion");

            done()
        });
        sandbox.replace(MotionNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                motion: { motion: false }
            });
        });
    });

    it('should call status() with "grey/dot/" when resource==null', function (done) {
        const fakeResource = sandbox.fake.returns(null);
        sandbox.replace(MotionNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(MotionNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                motion: { motion: true }
            });
        });
    });

    it('should call status() with "grey/dot/" when motion==null', function (done) {
        const fakeResource = sandbox.fake.returns({
            data: function() {
                return { motion: { motion: null } }
            }
        });
        sandbox.replace(MotionNode.prototype,'resource',fakeResource);
        const fakeStatus = sandbox.fake(() => {

            args = fakeStatus.firstArg;
            assert.equal(args.fill,"grey");
            assert.equal(args.shape,"dot");
            assert.equal(args.text,"");

            done()
        });
        sandbox.replace(MotionNode.prototype,'status',fakeStatus);

        var flow = [{
            id: "n1",
            type: "MotionNode",
            name: "motion node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                motion: { motion: true }
            });
        });
    });
});