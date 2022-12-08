const ClipApi = require('../src/clip/ClipApi')
const sinon = require('sinon');
//const { assert } = require('chai');
const assert = require('assert');

describe('ClipApi', function () {
    beforeEach(()=>{
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should call _initRestApi() on construction', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => done());
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        var clip = new ClipApi();
        clip.destructor();
    });

    it('should call _initEventStream on construction', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => done());
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        var clip = new ClipApi();
        clip.destructor();
    });

    it('should call _requestResources on construction', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => done());
        var clip = new ClipApi();
        clip.destructor();
    });

    it('should return restApi value when _restApi() is called', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => "test");
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => done());
        var clip = new ClipApi();
        assert.equal(clip._restApi(),"test");
        clip.destructor();
    });

    // =============================
    // TODO: 
    // _initEventStream
    // =============================

    it('should call _processStreamEvent when _processStreamMessage is called and message is present', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_processStreamEvent').callsFake(() => done());

        var clip = new ClipApi();
        clip._processStreamMessage({
            data: '[{"creationtime":"2022-12-06T00:19:58Z","data":[{"id":"34d36d20-6e6b-4f53-a56f-30ce325ece5f","id_v1":"/sensors/49","light":{"light_level":0,"light_level_valid":true},"owner":{"rid":"57f16acb-0939-40bd-9ed0-5641205e5a81","rtype":"device"},"type":"light_level"}],"id":"59f491f9-a9be-4e7a-b128-37cdb17b4ed0","type":"update"}]'
        });
        clip.destructor();
    });

    it('should call getResource(event.rid).onEvent(event) when _processStreamEvent is called and message is present', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() => true);
        sandbox.stub(ClipApi.prototype,'getResource').callsFake(() => {
            return {
                onEvent: function(event) {
                    done();
                }
            };
        });

        var clip = new ClipApi();
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
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() => false);
        sandbox.stub(ClipApi.prototype,'getResource').callsFake(() => assert.fail('should not reach here') );

        var clip = new ClipApi();
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

    it('should call _processResources and _restApi when _requestResources is called', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_processResources').callsFake(() => done());

        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                get: function(url) {
                    return new Promise((resolve,reject) => {
                        assert.equal(url,"/clip/v2/resource")
                        resolve();
                    });
                }
            };
        });

        var clip = new ClipApi();
        // _requestResources is called during construction.
        clip.destructor();
    });

    it('should catch errors when _requestResources triggers an error condition while calling _restApi().get fails', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_processResources').callsFake(() => { throw "exception" });

        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                get: function(url) {
                    return new Promise((resolve,reject) => {
                        assert.equal(url,"/clip/v2/resource")
                        reject();
                    });
                }
            };
        });

        var clip = new ClipApi();
        // _requestResources is called during construction.
        clip.destructor();
        done();
    });

    it('should register resources when _processResources is called', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() => false);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_registerResource').callsFake((resource) => {
            assert.equal(resource.id(),"button/1284f4e7-f0d6-4736-b93f-41df5456a989");
        });

        var clip = new ClipApi();
        clip._processResources({
            data: [
                { type: "button", id: "1284f4e7-f0d6-4736-b93f-41df5456a989" }
            ]
        });
        clip.destructor();
        done();
    });

    it('should not register resources when _processResources is called but _isResourceRegistered returns true', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() =>true);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_registerResource').callsFake((resource) => {
            throw "exceptions";
        });

        var clip = new ClipApi();
        clip._processResources({
            data: [
                { type: "button", id: "1284f4e7-f0d6-4736-b93f-41df5456a989" }
            ]
        });
        clip.destructor();
        done();
    });

    it('should call _isResourceRegistered when _processResources is called with unknonw type', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() =>true);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_registerResource').callsFake((resource) => {
            throw "exceptions";
        });

        var clip = new ClipApi();
        clip._processResources({
            data: [
                { type: "unknown", id: "1284f4e7-f0d6-4736-b93f-41df5456a989" }
            ]
        });
        clip.destructor();
        done();
    });

    it('should call resource.start() when _processResources is called and registered resources are present in the Q', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() =>true);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_registerResource').callsFake((resource) => {
            throw "exceptions";
        });

        var clip = new ClipApi();
        clip.requestStartup({
            rid: function() {
                return "resource";
            },
            start: function() {
                done();
            }
        });
        clip._processResources({
            data: [
                { type: "unknown", id: "1284f4e7-f0d6-4736-b93f-41df5456a989" }
            ]
        });
        clip.destructor();
    });

    it('should not have registered resources after startup', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var clip = new ClipApi();
        var result = clip._isResourceRegistered("1284f4e7-f0d6-4736-b93f-41df5456a989");
        assert.equal(result,false);
        clip.destructor();
        done();
    });

    it('should return true when _isResourceRegistered is called for registered resource ids', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var clip = new ClipApi();
        clip._registerResource({
            id: function() { return "1284f4e7-f0d6-4736-b93f-41df5456a989"; },
            rid: function() { return "1284f4e7-f0d6-4736-b93f-41df5456a989"; }
        });
        var result = clip._isResourceRegistered("1284f4e7-f0d6-4736-b93f-41df5456a989");
        assert.equal(result,true);
        clip._unregisterResource({
            id: function() { return "1284f4e7-f0d6-4736-b93f-41df5456a989"; },
            rid: function() { return "1284f4e7-f0d6-4736-b93f-41df5456a989"; }
        });
        clip.destructor();
        done();
    });

    it('should call resource.start() when a resource calls requestsStartup() after clip has started.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_isResourceRegistered').callsFake(() =>true);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_registerResource').callsFake((resource) => {
            throw "exceptions";
        });

        var clip = new ClipApi();
        clip._processResources({
            data: [
                { type: "unknown", id: "1284f4e7-f0d6-4736-b93f-41df5456a989" }
            ]
        });
        clip.requestStartup({
            rid: function() {
                return "resource";
            },
            start: function() {
                done();
            }
        });
        clip.destructor();
    });

    it('should call eventSource.close() when _stopEventStream() is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => {
            return {
                onmessage: "message",
                close: function() {
                    done();
                }
            };
        });
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        var clip = new ClipApi();
        // _stopEventStream is called from destructor();
        clip.destructor();
    });

    it('should return appropriate resource when getResource() is called with registered rid.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        var clip = new ClipApi();
        var resource = {
            id: function() { return "id"; },
            rid: function() { return "rid"; }
        };
        clip._registerResource(resource);
        assert.equal(clip.getResource(resource.rid()),resource);
        clip._unregisterResource(resource);
        clip.destructor();
        done();
    });

    it('should return null when getResource() is called with unregisterd rid.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        var clip = new ClipApi();
        assert.equal(clip.getResource("unregistered id"), null);
        clip.destructor();
        done();
    });

    it('should call _restApi().get() when get() is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                get: function(url) {
                    assert.equal(url,"/clip/v2/resource/rtype/rid");
                    done();
                }
            }
        });
        var clip = new ClipApi();
        clip.get("rtype","rid");
        clip.destructor();
    });

    it('should call _restApi().put() when put() is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                put: function(url,data) {
                    assert.equal(url,"/clip/v2/resource/rtype/rid");
                    assert.equal(data,"data");
                    done();
                }
            }
        });
        var clip = new ClipApi();
        clip.put("rtype","rid","data");
        clip.destructor();
    });

    it('should call _restApi().post() when post() is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                post: function(url,data) {
                    assert.equal(url,"/clip/v2/resource/rtype/rid");
                    assert.equal(data,"data");
                    done();
                }
            }
        });
        var clip = new ClipApi();
        clip.post("rtype","rid","data");
        clip.destructor();
    });

    it('should call _restApi().delete() when delete() is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_restApi').callsFake(() => {
            return {
                delete: function(url,data) {
                    assert.equal(url,"/clip/v2/resource/rtype/rid");
                    assert.equal(data,"data");
                    done();
                }
            }
        });
        var clip = new ClipApi();
        clip.delete("rtype","rid","data");
        clip.destructor();
    });

    it('should return matching types when getSortedResourceByTypeAndModel is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var resources = [
            {
                id: function() { return "my button"; },
                rid: function() { return "bc7402c9-84fe-4b51-9ca3-0623995337e4"; },
                rtype: function() { return "button"; },
                data: function() { return { } }
            },
            {
                id: function() { return "my light"; },
                rid: function() { return "91848489-27e1-48ff-9e27-8746a0a92cd6"; },
                rtype: function() { return "light"; },
                data: function() { return { } }
            },
            {
                id: function() { return "a light"; },
                rid: function() { return "7df6f521-c78e-496e-8914-ef1b75737a81"; },
                rtype: function() { return "light"; },
                data: function() { return { } }
            },
            {
                id: function() { return "my light"; },
                rid: function() { return "96ef1ccd-e580-41e3-a5f2-d3aecd6ccd66"; },
                rtype: function() { return "light"; },
                data: function() { return { } }
            },
            {
                id: function() { return "yet another light"; },
                rid: function() { return "75f94a58-b34e-4f6a-b9f6-9ee3841ed42f"; },
                rtype: function() { return "light"; },
                data: function() { return { product_data: { model_id: "model" } } }
            },
        ];

        var clip = new ClipApi();
        resources.forEach(resource => {
            clip._registerResource(resource);
        });
        var result1 = clip.getSortedResourcesByTypeAndModel("light");
        assert.equal(result1.length,4);
        var result2 = clip.getSortedResourcesByTypeAndModel("button");
        assert.equal(result2.length,1);
        var result3 = clip.getSortedResourcesByTypeAndModel("light",["model"]);
        assert.equal(result3.length,1);
        resources.forEach(resource => {
            clip._unregisterResource(resource);
        });
        clip.destructor();
        done();
    });

    it('should return matching types when getSortedResourceOptions is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'getSortedResourcesByTypeAndModel').callsFake(() => {
            return [
                {
                    rid: function() { return "e23ce504-d180-43e7-bd04-560cc6b92706"; },
                    name: function() { return "my light";},
                    rtype: function() { return "light"; }
                },
                {
                    rid: function() { return "61bfa38e-5c69-4c36-9c01-9b91e42c3b36"; },
                    name: function() { return "my light";},
                    rtype: function() { return "light"; }
                },
                {
                    rid: function() { return "e5a796b2-2f6a-4ea1-894e-34295d03c96a"; },
                    name: function() { return "a light";},
                    rtype: function() { return "light"; }
                },
                {
                    rid: function() { return "957c7833-d480-4b3b-ae59-603106443adc"; },
                    name: function() { return "some light";},
                    rtype: function() { return "light"; }
                },
                {
                    id: function() { return "0f062369-2151-42c7-8b6c-203f9c3141ee"; },
                    rid: function() { return "0f062369-2151-42c7-8b6c-203f9c3141ee"; },
                    name: function() { return null;},
                    rtype: function() { return "light"; }
                }
            ];
        });

        var clip = new ClipApi();
        var result = clip.getSortedResourceOptions("light");
        assert.equal(result.length,5);
        clip.destructor();

        done();
    });

    it('should return matching types when getSortedTypeOptions is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var resources = [
            {
                id: function() { return "041b26f5-cb27-40ea-955c-8436285823cd"; },
                rid: function() { return "041b26f5-cb27-40ea-955c-8436285823cd"; },
                rtype: function() { return "zigbee_connectivity"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "cfebc28a-ecae-4c68-86ba-ac69f33aa6e1"; },
                rid: function() { return "cfebc28a-ecae-4c68-86ba-ac69f33aa6e1"; },
                rtype: function() { return "zigbee_connectivity"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "6570a67a-b2de-4fb2-bc12-03d586536f71"; },
                rid: function() { return "6570a67a-b2de-4fb2-bc12-03d586536f71"; },
                rtype: function() { return "motion"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "72ff9667-88e5-4e84-ab7e-0fbe2f2b7f89"; },
                rid: function() { return "72ff9667-88e5-4e84-ab7e-0fbe2f2b7f89"; },
                rtype: function() { return "device_power"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "0fb708f6-dfea-4c7a-9f09-2d6f0d941eb1"; },
                rid: function() { return "0fb708f6-dfea-4c7a-9f09-2d6f0d941eb1"; },
                rtype: function() { return "temperature"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "31d66d0b-e75a-451f-97fd-76c8ca458c29"; },
                rid: function() { return "31d66d0b-e75a-451f-97fd-76c8ca458c29"; },
                rtype: function() { return "light_level"; },
                owner: function() { return "owner"; }
            },
            {
                id: function() { return "a1c0daf9-1c10-44b5-8258-b0f2d862ea91"; },
                rid: function() { return "a1c0daf9-1c10-44b5-8258-b0f2d862ea91"; },
                rtype: function() { return "light_level"; },
                owner: function() { return null; }
            },
        ];

        var clip = new ClipApi();
        resources.forEach(resource => {
            clip._registerResource(resource);
        });
        var result = clip.getSortedTypeOptions();
        assert.equal(result.length,5);
        resources.forEach(resource => {
            clip._unregisterResource(resource);
        });
        clip.destructor();

        done();
    });

    it('should return matching types when getSortedOwnerOptions is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var resources = [
            {
                id: function() { return "041b26f5-cb27-40ea-955c-8436285823cd"; },
                rid: function() { return "041b26f5-cb27-40ea-955c-8436285823cd"; },
                rtype: function() { return "device"; },
                name: function() { return "name2"; },
                services: function() { return [
                    {
                        id: function() { return "7ae38812-75e1-4393-bbeb-ab9db8726d2c"; },
                        rid: function() { return "7ae38812-75e1-4393-bbeb-ab9db8726d2c"; },
                        rtype: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "bde386c8-fe79-4cad-9609-491e50d412f5"; },
                        rid: function() { return "bde386c8-fe79-4cad-9609-491e50d412f5"; },
                        rtype: function() { return "zigbee_connectivity"; },
                    }
                ]; }
            },
            {
                id: function() { return "84216428-9c3d-4c03-85b7-9e42adbbe975"; },
                rid: function() { return "84216428-9c3d-4c03-85b7-9e42adbbe975"; },
                rtype: function() { return "device"; },
                name: function() { return "name1"; },
                services: function() { return [
                    {
                        id: function() { return "c9aef6ff-1ba6-4d92-b9a9-4f87e95e90b0"; },
                        rid: function() { return "c9aef6ff-1ba6-4d92-b9a9-4f87e95e90b0"; },
                        rtype: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "3731be73-36fb-4d04-8a57-086eb51f80c8"; },
                        rid: function() { return "3731be73-36fb-4d04-8a57-086eb51f80c8"; },
                        rtype: function() { return "zigbee_connectivity"; },
                    }
                ]; }
            },
            {
                id: function() { return "8d9341f8-63d5-46d6-8b41-7da87290b398"; },
                rid: function() { return "8d9341f8-63d5-46d6-8b41-7da87290b398"; },
                rtype: function() { return "device"; },
                name: function() { return "name3"; },
                services: function() { return [
                    {
                        id: function() { return "f85fae4c-5996-434d-8598-bfc4364de5d8"; },
                        rid: function() { return "f85fae4c-5996-434d-8598-bfc4364de5d8"; },
                        rtype: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "7d3b7ed2-c619-4d62-8232-c738f35ca25e"; },
                        rid: function() { return "7d3b7ed2-c619-4d62-8232-c738f35ca25e"; },
                        rtype: function() { return "zigbee_connectivity"; },
                    }
                ]; }
            },
            {
                id: function() { return "9e66209b-f177-4411-8ab6-65277589f39c"; },
                rid: function() { return "9e66209b-f177-4411-8ab6-65277589f39c"; },
                rtype: function() { return "device"; },
                name: function() { return "name1"; },
                services: function() { return [
                    {
                        id: function() { return "6fd13b8c-1e60-4bb9-b43e-a2bd53ff328f"; },
                        rid: function() { return "6fd13b8c-1e60-4bb9-b43e-a2bd53ff328f"; },
                        rtype: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "161df2c4-6f5d-4a70-809b-de33dfc1b094"; },
                        rid: function() { return "161df2c4-6f5d-4a70-809b-de33dfc1b094"; },
                        rtype: function() { return "zigbee_connectivity"; },
                    }
                ]; }
            },
            {
                id: function() { return "006a2033-c3ba-479d-9120-a31fe4682ce6"; },
                rid: function() { return "006a2033-c3ba-479d-9120-a31fe4682ce6"; },
                rtype: function() { return "device"; },
                name: function() { return "name"; },
            }
        ];

        var clip = new ClipApi();
        resources.forEach(resource => {
            clip._registerResource(resource);
        });
        var result = clip.getSortedOwnerOptions("zigbee_connectivity");
        assert.equal(result.length,4);
        resources.forEach(resource => {
            clip._unregisterResource(resource);
        });
        clip.destructor();

        done();
    });

    it('should return matching types when getSortedOwnerOptions is called.', function (done) {
        sandbox.stub(ClipApi.prototype,'_initRestApi').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_initEventStream').callsFake(() => null);
        sandbox.stub(ClipApi.prototype,'_requestResources').callsFake(() => null);

        var resources = [
            {
                id: function() { return "8d9341f8-63d5-46d6-8b41-7da87290b398"; },
                rid: function() { return "8d9341f8-63d5-46d6-8b41-7da87290b398"; },
                rtype: function() { return "device"; },
                name: function() { return "name3"; },
                services: function() { return [
                    {
                        id: function() { return "f85fae4c-5996-434d-8598-bfc4364de5d8"; },
                        rid: function() { return "f85fae4c-5996-434d-8598-bfc4364de5d8"; },
                        rtype: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "7d3b7ed2-c619-4d62-8232-c738f35ca25e"; },
                        rid: function() { return "7d3b7ed2-c619-4d62-8232-c738f35ca25e"; },
                        rtype: function() { return "zigbee_connectivity"; },
                    }
                ]; }
            },
            {
                id: function() { return "9e66209b-f177-4411-8ab6-65277589f39c"; },
                rid: function() { return "9e66209b-f177-4411-8ab6-65277589f39c"; },
                rtype: function() { return "device"; },
                name: function() { return "name1"; },
                services: function() { return [
                    {
                        id: function() { return "6fd13b8c-1e60-4bb9-b43e-a2bd53ff328f"; },
                        rid: function() { return "6fd13b8c-1e60-4bb9-b43e-a2bd53ff328f"; },
                        rtype: function() { return "device_power"; },
                        typeName: function() { return "device_power"; },
                    },
                    {
                        id: function() { return "161df2c4-6f5d-4a70-809b-de33dfc1b094"; },
                        rid: function() { return "161df2c4-6f5d-4a70-809b-de33dfc1b094"; },
                        rtype: function() { return "zigbee_connectivity"; },
                        typeName: function() { return "zigbee_connectivity"; },
                    },
                    {
                        id: function() { return "0469dfdf-1ff4-445e-8186-8199f8e83d82"; },
                        rid: function() { return "0469dfdf-1ff4-445e-8186-8199f8e83d82"; },
                        rtype: function() { return "button"; },
                        typeName: function() { return "button1"; },
                    },
                    {
                        id: function() { return "button2"; },
                        rid: function() { return "636030af-eca9-4b19-90ff-39463f6182f3"; },
                        rtype: function() { return "button"; },
                        typeName: function() { return "button3"; },
                    },
                    {
                        id: function() { return "button2"; },
                        rid: function() { return "636030af-eca9-4b19-90ff-39463f6182f3"; },
                        rtype: function() { return "button"; },
                        typeName: function() { return "button2"; },
                    },
                    {
                        id: function() { return "button2"; },
                        rid: function() { return "636030af-eca9-4b19-90ff-39463f6182f3"; },
                        rtype: function() { return "button"; },
                        typeName: function() { return "button4"; },
                    },
                    {
                        id: function() { return "button2"; },
                        rid: function() { return "636030af-eca9-4b19-90ff-39463f6182f3"; },
                        rtype: function() { return "button"; },
                        typeName: function() { return "button4"; },
                    }
                ]; }
            }
        ];

        var clip = new ClipApi();
        resources.forEach(resource => {
            clip._registerResource(resource);
        });
        var result = clip.getSortedServiceOptions("9e66209b-f177-4411-8ab6-65277589f39c","button");
        assert.equal(result.length,5);
        resources.forEach(resource => {
            clip._unregisterResource(resource);
        });
        clip.destructor();

        done();
    });
});
