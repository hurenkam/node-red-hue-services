const assert = require('assert');
const TestResource = require('./mocks/TestResource');

class TestClip {
    static mock = {}

    get(rtype,rid) {
        if (TestClip.mock.get) {
            return TestClip.mock.get(rtype,rid);
        }
    }
    put(rtype,rid,data) {
        if (TestClip.mock.put) {
            return TestClip.mock.put(rtype,rid,data);
        }
    }
    getResource() {
        if (TestClip.mock.getResource) {
            return TestClip.mock.getResource();
        }
    }
}

describe('Resource', function () {
    //afterEach(function () {
    //    helper.unload();
    //});

    it('should construct and destruct', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        resource.destructor();
        done();
    });

    it('should return data', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        var data = resource.data();
        assert.equal(data.type,"button");
        done();
    });

    it('should return clip', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        var clip = resource.clip();
        assert.equal(clip.name,"clip");
        done();
    });

    it('should return rid', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        var rid = resource.rid();
        assert.equal(rid,"1801c6af-fff3-40b4-b5fa-2a056ce7a192");
        done();
    });

    it('should return rtype', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        var rtype = resource.rtype();
        assert.equal(rtype,"button");
        done();
    });

    it('should return data().metadata.name if present and name() is called', function (done) {
        TestClip.mock = {
            getResource: function() {
                return "clip.getResource"
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
            metadata: {
                name: "Button"
            }
        }, new TestClip());
        var name = resource.name();
        assert.equal(name,"Button");
        done();
    });

    it('should return owner().name() if present and name() is called with no data().metadata available', function (done) {
        TestClip.mock = {
            getResource: function() {
                return {
                    rid: "c8867c84-f519-4012-9da9-79b801fc0a70",
                    name: function() {
                        return "Owner"
                    }
                }
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
            owner: {
                rid: "c8867c84-f519-4012-9da9-79b801fc0a70"
            },
        }, new TestClip());
        var name = resource.name();
        assert.equal(name,"Owner");
        done();
    });

    it('should call clip.getResource when looking up owner() if owner was set', function (done) {
        TestClip.mock = {
            getResource: function() {
                return {
                    rid: "0c0f44df-e613-46aa-8da8-d4b378ed4d12",
                    name: function() {
                        return "Owner"
                    }
                }
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
            owner: { 
                rid: "0c0f44df-e613-46aa-8da8-d4b378ed4d12"
            }
        }, new TestClip());

        var rid = resource.owner().rid;
        assert.equal(rid,"0c0f44df-e613-46aa-8da8-d4b378ed4d12");
        done();
    });

    it('should return null when looking up owner() if owner was not set', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, new TestClip());
        var owner = resource.owner();
        assert.equal(owner,null);
        done();
    });

    it('should return type as typeName if no control_id is present', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
        }, {
            name: "clip"
        });
        var typeName = resource.typeName();
        assert.equal(typeName,"button");
        done();
    });

    it('should return type with number as typeName if control_id is present', function (done) {
        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "button",
            metadata: { 
                control_id: 3
            }
        }, {
            name: "clip"
        });
        var typeName = resource.typeName();
        assert.equal(typeName,"button3");
        done();
    });

    it('should lookup service resources if services() is called and data().services is not empty', function (done) {
        TestClip.mock = {
            getResource: function() {
                return {
                    rid: "0c0f44df-e613-46aa-8da8-d4b378ed4d12",
                    name: function() {
                        return "Owner"
                    }
                }
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            services: [{
                    rid: "2194dc5c-42ac-4f8b-845d-4af234cc1e6b",
                    rtype: "button"
                },{
                    rid: "08f8c311-9e2c-4028-8a2d-625a0c260cb4",
                    rtype: "button"
                }
            ]
        }, new TestClip());
        var services = resource.services();
        assert.equal(Object.keys(services).length,2);
        done();
    });

    it('should return empty list if services() is called and data().services is not present', function (done) {
        TestClip.mock = {
            getResource: function() {
                return {
                    rid: "0c0f44df-e613-46aa-8da8-d4b378ed4d12",
                    name: function() {
                        return "Owner"
                    }
                }
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
        }, new TestClip());
        var services = resource.services();
        assert.equal(Object.keys(services).length,0);
        done();
    });

    it('should return empty list if services() is called and resource lookup fails', function (done) {
        TestClip.mock = {
            getResource: function() {
                return null;
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            services: [{
                    rid: "2194dc5c-42ac-4f8b-845d-4af234cc1e6b",
                    rtype: "button"
                },{
                    rid: "08f8c311-9e2c-4028-8a2d-625a0c260cb4",
                    rtype: "button"
                }
            ]
        }, new TestClip());
        var services = resource.services();
        assert.equal(Object.keys(services).length,0);
        done();
    });

    it('should forward get() to clip().get() with rtype() and rid() as parameters', function (done) {
        TestClip.mock = {
            get: function(rtype,rid) {
                assert.equal(rtype,"device");
                assert.equal(rid,"1801c6af-fff3-40b4-b5fa-2a056ce7a192");
                done();
            },
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            metadata: {
                name: "Device"
            }
        }, new TestClip());
        resource.get();
    });

    it('should forward put() to clip().put() with rtype() and rid() as parameters', function (done) {
        TestClip.mock = {
            put: function(rtype,rid,data) {
                assert.equal(rtype,"device");
                assert.equal(rid,"1801c6af-fff3-40b4-b5fa-2a056ce7a192");
                assert.equal(data,"testdata");
                done();
            },
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            metadata: {
                name: "Device"
            }
        }, new TestClip());
        resource.put("testdata");
    });

    it('should appropriate data fields with information from event provided in updateStatus(event) call', function (done) {
        TestClip.mock = {
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            metadata: {
                name: "Device"
            }
        }, new TestClip());
        resource.updateStatus({
            id: "new_id",
            button: { 
                last_event: "initial_press"
            }
        });
        var data = resource.data();

        // button event should be updated
        assert.equal(data.button.last_event,"initial_press");

        // id should not be updated
        assert.equal(data.id,"1801c6af-fff3-40b4-b5fa-2a056ce7a192");

        done();
    });

    it('should call updateStatus(event) when onEvent(event) is callled', function (done) {
        TestClip.mock = {
        }

        TestResource.mock = {
            updateStatus: function(event) {
                done();
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            metadata: {
                name: "Device"
            }
        }, new TestClip());
        resource.onEvent({
            id: "new_id",
            button: { 
                last_event: "initial_press"
            }
        });
    });

    it('should emit update event when onEvent(event) is callled', function (done) {
        TestClip.mock = {
        }

        TestResource.mock = {
            updateStatus: function(event) {
            }
        }

        var resource = new TestResource({
            id: "1801c6af-fff3-40b4-b5fa-2a056ce7a192",
            type: "device",
            metadata: {
                name: "Device"
            }
        }, new TestClip());
        resource.on("update",function(event) {
            done();
        })
        resource.onEvent({
            id: "new_id",
            button: { 
                last_event: "initial_press"
            }
        });
    });
});
