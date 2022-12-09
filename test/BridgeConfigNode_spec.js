var helper = require("node-red-node-test-helper");
const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');

var testnodes = function(RED) {
    "use strict";

    const BaseNode = require('../src/nodes/BaseNode');
    BaseNode.nodeAPI = RED;

    RED.nodes.registerType("BridgeConfigNode",BridgeConfigNode);
}
const BridgeConfigNode = require('../src/nodes/BridgeConfigNode');
const ClipApi = require('../src/clip/ClipApi');

describe('Bridge Config Node (instance)', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
        helper.unload();
      });

    it('should be loaded', function (done) {
        const fakeClip = sandbox.fake(() => { return {
            name: "clip",
            destructor: function() {}
        } });
        sandbox.replace(BridgeConfigNode.prototype,'_constructClip',fakeClip);

        var flow = [{ 
            id: "n1",
            type: "BridgeConfigNode",
            name: "bridge config node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            var config = n1.config;
            config.should.have.property('name', 'bridge config node');
            var clip = n1.clip();
            clip.should.have.property('name','clip');
            var bridges = BridgeConfigNode.bridges();
            bridges['n1'].should.have.property('id','n1');
            done();
        });
    });

    it('catch errors when executing on("close")', function (done) {
        const fakeClip = sandbox.fake(() => { return {
            name: "clip",
            destructor: function() {}
        } });
        sandbox.replace(BridgeConfigNode.prototype,'_constructClip',fakeClip);
        const fakeDestructor = sandbox.fake(() => { throw "Exception"; })
        sandbox.replace(BridgeConfigNode.prototype,'destructor',fakeDestructor);

        var flow = [{ 
            id: "n1",
            type: "BridgeConfigNode",
            name: "bridge config node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.close();
            done();
        });
    });

    it('should call clip.requestStartup when requestStartup() is called', function (done) {
        const fakeClip = sandbox.fake(() => { return {
            name: "clip",
            destructor: function() {},
            requestStartup: function() { done(); }
        } });
        sandbox.replace(BridgeConfigNode.prototype,'_constructClip',fakeClip);

        var flow = [{ 
            id: "n1",
            type: "BridgeConfigNode",
            name: "bridge config node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.requestStartup("resource");
        });
    });

    it('should not attempt to call clip.requestStartup when clip is null', function (done) {
        const fakeClip = sandbox.fake(() => { return null; } );
        sandbox.replace(BridgeConfigNode.prototype,'_constructClip',fakeClip);

        var flow = [{ 
            id: "n1",
            type: "BridgeConfigNode",
            name: "bridge config node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
            n1.requestStartup("resource");
            done();
        });
    });

    it('should construct Clip instance', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(done);

        var flow = [{ 
            id: "n1",
            type: "BridgeConfigNode",
            name: "bridge config node",
        }];

        helper.load(testnodes, flow, function () {
            var n1 = helper.getNode("n1");
        });
    });
});

describe('Bridge Config Node (static)', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should discover bridges', function (done) {
        var count = 0;
        sandbox.stub(BridgeConfigNode,'_axios').callsFake(function() {
            if (count > 0) {
                count++;
                //console.log("fake bridge query");
                return Promise.resolve({ data: {}});
            } else {
                //console.log("fake meethue query");
                return Promise.resolve({ data: [{ "internalipaddress": "ip" }]});
            }
        });

        BridgeConfigNode.DiscoverBridges();
        done();
    });

    it('should acquire application key', function (done) {
        sandbox.stub(BridgeConfigNode,'_axios').callsFake(function() {
            return Promise.resolve({ data : [
                { success: "username" }
            ]});
        });

        BridgeConfigNode.AcquireApplicationKey("ip");
        done();
    });

    it('should acquire application key, but returns error', function (done) {
        sandbox.stub(BridgeConfigNode,'_axios').callsFake(function() {
            return Promise.resolve({ data : [
                { error: "some error" }
            ]});
        });

        BridgeConfigNode.AcquireApplicationKey("ip");
        done();
    });

    it('should acquire application key, but throws exception', function (done) {
        sandbox.stub(BridgeConfigNode,'_axios').callsFake(function() {
            return Promise.reject("trigger exception");
        });

        BridgeConfigNode.AcquireApplicationKey("ip");
        done();
    });
});
