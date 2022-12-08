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
        //sandbox.stub(ButtonNode.prototype,'id').callsFake(() => "id");

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
        this.timeout(5000);
        sandbox.stub(ButtonNode.prototype,'updateStatus')
            .onFirstCall().callsFake(()=>{})
            .onSecondCall().callsFake(()=>done());

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

    it('should call status() twice with 3s delay when onUpdate(event) is called', function (done) {
        this.timeout(5000);
        sandbox.stub(ButtonNode.prototype,'resource').returns({
            data: function() {
                return { button: { last_event: "last_event" }}
            }
        });
        statuscount = 0;
        sandbox.stub(ButtonNode.prototype,'status')
            .onFirstCall().callsFake((fill,shape,text)=>{
                assert.equal(fill,"blue");
                assert.equal(shape,"dot");
                assert.equal(text,"last_event");
            })
            .onSecondCall().callsFake(()=> {
                done();
            });

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

    it('should call status() twice with 3s delay when onUpdate(event) is called', function (done) {
        this.timeout(5000);
        sandbox.stub(ButtonNode.prototype,'resource').returns(null);
        statuscount = 0;
        sandbox.stub(ButtonNode.prototype,'status')
            .onFirstCall().callsFake((fill,shape,text)=>{
                assert.equal(fill,"blue");
                assert.equal(shape,"dot");
                assert.equal(text,"");
            })
            .onSecondCall().callsFake(()=> {
                done();
            });

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

    it('should call status() twice with 3s delay when onUpdate(event) is called', function (done) {
        this.timeout(5000);
        sandbox.stub(ButtonNode.prototype,'resource').returns({
            data: function() {
                return { button: { last_event: null }}
            }
        });
        sandbox.stub(ButtonNode.prototype,'status')
            .onFirstCall().callsFake((fill,shape,text)=>{
                assert.equal(fill,"blue");
                assert.equal(shape,"dot");
                assert.equal(text,"");
            })
            .onSecondCall().callsFake(()=> {
                done();
            });

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