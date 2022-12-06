const assert = require('assert');
const TestClipApi = require('./mocks/TestClipApi');
const TestResource = require('./mocks/TestResource');


describe('ClipApi', function () {
    it('should call _initRestApi() on construction', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
                done();
            },
            _initEventStream: function() {
            },
            _requestResources: function() {
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip.destructor();
    });

    it('should call _initEventStream on construction', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
            },
            _initEventStream: function() {
                done();
            },
            _requestResources: function() {
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip.destructor();
    });

    it('should call _requestResources on construction', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
            },
            _initEventStream: function() {
            },
            _requestResources: function() {
                done();
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip.destructor();
    });

    // =============================
    // TODO: _initEventStream
    // =============================

    it('should call _processStreamEvent when _processStreamMessage is called and message is present', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
            },
            _initEventStream: function() {
            },
            _requestResources: function() {
            },
            _processStreamEvent: function(event) {
                done();
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip._processStreamMessage({
            data: '[{"creationtime":"2022-12-06T00:19:58Z","data":[{"id":"34d36d20-6e6b-4f53-a56f-30ce325ece5f","id_v1":"/sensors/49","light":{"light_level":0,"light_level_valid":true},"owner":{"rid":"57f16acb-0939-40bd-9ed0-5641205e5a81","rtype":"device"},"type":"light_level"}],"id":"59f491f9-a9be-4e7a-b128-37cdb17b4ed0","type":"update"}]'
        });
        clip.destructor();
    });

    it('should call getResource(event.rid).onEvent(event) when _processStreamEvent is called and message is present', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
            },
            _initEventStream: function() {
            },
            _requestResources: function() {
            },
            _isResourceRegistered: function() {
                return true;
            },
            getResource: function() {
                return ({
                    onEvent: function(event) {
                        done();
                    }
                });
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip._processStreamEvent({
            "id": "34d36d20-6e6b-4f53-a56f-30ce325ece5f",
            "id_v1": "/sensors/49",
            "light": { 
                "light_level": 0,
                "light_level_valid": true
            },
            "owner": {
                "rid": "57f16acb-0939-40bd-9ed0-5641205e5a81",
                "rtype": "device"
            },
            "type": "light_level"
        });
        clip.destructor();
    });

    it('should not call getResource(event.rid).onEvent(event) if resource is not registered', function (done) {
        var ip = "192.168.9.99";
        var key = "d4f2938f-50d3-4a66-97c9-528ce4953c05";
        var name = "TestBridge";
        TestClipApi.mock = {
            _initRestApi: function() {
            },
            _initEventStream: function() {
            },
            _requestResources: function() {
            },
            _isResourceRegistered: function() {
                return false;
            },
            getResource: function() {
                return ({
                    onEvent: function(event) {
                        assert.fail("should not reach here");
                    }
                });
            }
        }
        var clip = new TestClipApi(ip,key,name);
        clip._processStreamEvent({
            "id": "34d36d20-6e6b-4f53-a56f-30ce325ece5f",
            "id_v1": "/sensors/49",
            "light": { 
                "light_level": 0,
                "light_level_valid": true
            },
            "owner": {
                "rid": "57f16acb-0939-40bd-9ed0-5641205e5a81",
                "rtype": "device"
            },
            "type": "light_level"
        });
        clip.destructor();
        done();
    });
});
