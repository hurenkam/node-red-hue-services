const ClipApi = require('../../src/clip/ClipApi');

class TestClipApi extends ClipApi {
    static mock = { }

    _initRestApi() {
        if (TestClipApi.mock._initRestApi) {
            return TestClipApi.mock._initRestApi();
        }
        return super._initRestApi();
    }

    _initEventStream() {
        if (TestClipApi.mock._initEventStream) {
            return TestClipApi.mock._initEventStream();
        }
        return super._initEventStream();
    }

    _processStreamMessage(streammessage) {
        if (TestClipApi.mock._processStreamMessage) {
            return TestClipApi.mock._processStreamMessage(streammessage);
        }
        return super._processStreamMessage(streammessage);
    }

    _processStreamEvent(event) {
        if (TestClipApi.mock._processStreamEvent) {
            return TestClipApi.mock._processStreamEvent(event);
        }
        return super._processStreamEvent(event);
    }

    _requestResources() {
        if (TestClipApi.mock._requestResources) {
            return TestClipApi.mock._requestResources();
        }
        return super._requestResources();
    }

    _processResources(response) {
        if (TestClipApi.mock._processResources) {
            return TestClipApi.mock._processResources(response);
        }
        return super._processResources(response)
    }

    _isResourceRegistered(uuid) {
        if (TestClipApi.mock._isResourceRegistered) {
            return TestClipApi.mock._isResourceRegistered();
        }
        return super._isResourceRegistered(uuid);
    }

    _registerResource(resource) {
        if (TestClipApi.mock._registerResource) {
            return TestClipApi.mock._registerResource();
        }
        return super._registerResource(resource);
    }

    _unregisterResource(resource) {
        if (TestClipApi.mock._unregisterResource) {
            return TestClipApi.mock._unregisterResource(resource);
        }
        return super._unregisterResource();
    }

    _stopEventStream() {
        if (TestClipApi.mock._stopEventStream) {
            return TestClipApi.mock._stopEventStream();
        }
        return super._stopEventStream();
    }

    requestStartup(resource) {
        if (TestClipApi.mock.requestStartup) {
            return TestClipApi.mock.requestStartup(resource);
        }
        return super.requestStartup(resource);
    }

    destructor() {
        if (TestClipApi.mock.destructor) {
            return TestClipApi.mock.destructor();
        }
        return super.destructor();
    }

    getResource(rid) {
        if (TestClipApi.mock.getResource) {
            return TestClipApi.mock.getResource(rid);
        }
        return super.getResource(rid);
    }

    get(rtype,rid) {
        if (TestClipApi.mock.get) {
            return TestClipApi.mock.get(rtype,rid);
        }
        return super.get(rtype,rid);
    }

    put(rtype,rid,data) {
        if (TestClipApi.mock.put) {
            return TestClipApi.mock.put(rtype,rid,data);
        }
        return super.put(rtype,rid,data);
    }

    post(rtype,rid,data) {
        if (TestClipApi.mock.requestStartup) {
            return TestClipApi.mock.post(rtype,rid,data);
        }
        return super.post(rtype,rid,data);
    }

    delete(rtype,rid,data) {
        if (TestClipApi.mock.requestStartup) {
            return TestClipApi.mock.delete(rtype,rid,data);
        }
        return super.delete(rtype,rid,data);
    }

    getSortedServicesById(uuid) {
        if (TestClipApi.mock.getSortedServicesById) {
            return TestClipApi.mock.getSortedServicesById(uuid);
        }
        return super.getSortedServicesById(uuid);
    }

    getSortedResourcesByTypeAndModel(type,models) {
        if (TestClipApi.mock.getSortedResourcesByTypeAndModel) {
            return TestClipApi.mock.getSortedResourcesByTypeAndModel(type,models);
        }
        return super.getSortedResourcesByTypeAndModel(type,models);
    }

    getSortedResourceOptions(type, models) {
        if (TestClipApi.mock.getSortedResourceOptions) {
            return TestClipApi.mock.getSortedResourceOptions(type, models);
        }
        return super.getSortedResourceOptions(type, models);
    }

    getSortedTypeOptions() {
        if (TestClipApi.mock.getSortedTypeOptions) {
            return TestClipApi.mock.getSortedTypeOptions();
        }
        return super.getSortedTypeOptions();
    }

    getSortedOwnerOptions(rtype) {
        if (TestClipApi.mock.getSortedOwnerOptions) {
            return TestClipApi.mock.getSortedOwnerOptions(rtype);
        }
        return super.getSortedOwnerOptions(rtype);
    }

    getSortedServiceOptions(uuid,rtype) {
        if (TestClipApi.mock.getSortedServiceOptions) {
            return TestClipApi.mock.getSortedServiceOptions(uuid,rtype);
        }
        return super.getSortedServiceOptions(uuid,rtype);
    }
}

module.exports = TestClipApi
