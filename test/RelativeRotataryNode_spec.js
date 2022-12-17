const helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');

const testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("RelativeRotaryNode",RelativeRotaryNode);
}
const RelativeRotaryNode = require('../src/nodes/RelativeRotaryNode')

describe('RelativeRotaryNode', function () {
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
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('config');

            var config = n1.config;
            config.should.have.property('name', 'relative rotary node');
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
        sandbox.replace(RelativeRotaryNode.prototype,'updateStatus',fakeStatus);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                name: "event"
            });
        });
    });

    it('should call status() with "blue/dot/action >> 400 | 400" and "grey/dot/action >> 400 | 400"', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action >> 400 | 400");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action >> 400 | 400");
                done()
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { relative_rotary: {
                        last_event: {
                            action: "action",
                            rotation: {
                                direction: "clock_wise",
                                duration: 400,
                                steps: 400
                            }
                        }
                    }}
                }
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                relative_rotary: {
                    last_event: {
                        action: "action",
                        rotation: {
                            direction: "clock_wise",
                            duration: 400,
                            steps: 400
                        }
                    }
                }
            });
        });
    });

    it('should call status() with "blue/dot/action << 200 | 100" and "grey/dot/action << 200 | 100"', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action << 200 | 100");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action << 200 | 100");
                done()
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { relative_rotary: {
                        last_event: {
                            action: "action",
                            rotation: {
                                direction: "counter_clock_wise",
                                duration: 200,
                                steps: 100
                            }
                        }
                    }}
                }
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                relative_rotary: {
                    last_event: {
                        action: "action",
                        rotation: {
                            direction: "clock_wise",
                            duration: 400,
                            steps: 400
                        }
                    }
                }
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
        sandbox.replace(RelativeRotaryNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return null
        });
        sandbox.replace(RelativeRotaryNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                relative_rotary: {
                    last_event: {
                        action: "action",
                        rotation: {
                            direction: "clock_wise",
                            duration: 400,
                            steps: 400
                        }
                    }
                }
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
        sandbox.replace(RelativeRotaryNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { relative_rotary: {
                        last_event: null
                    }}
                }
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                relative_rotary: {
                    last_event: {
                        action: "action",
                        rotation: {
                            direction: "clock_wise",
                            duration: 400,
                            steps: 400
                        }
                    }
                }
            });
        });
    });

    it('should call status() with "blue/dot/action" and "grey/dot/action" when rotation==null', function (done) {
        var statuscount = 0;
        const fakeStatus = sandbox.fake(() => {
            var args = fakeStatus.firstArg;
            if (statuscount++ == 0) {
                assert.equal(args.fill,"blue");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action");
            } else {
                assert.equal(args.fill,"grey");
                assert.equal(args.shape,"dot");
                assert.equal(args.text,"action");
                done()
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'status',fakeStatus);
        const fakeResource = sandbox.fake(() => { 
            return {
                data: function() {
                    return { relative_rotary: {
                        last_event: {
                            action: "action",
                            rotation: null
                        }
                    }}
                }
            }
        });
        sandbox.replace(RelativeRotaryNode.prototype,'resource',fakeResource);

        var flow = [{
            id: "n1",
            type: "RelativeRotaryNode",
            name: "relative rotary node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.onUpdate({
                relative_rotary: {
                    last_event: {
                        action: "action",
                        rotation: {
                            direction: "clock_wise",
                            duration: 400,
                            steps: 400
                        }
                    }
                }
            });
        });
    });
});