const Resource = require('../../src/clip/Resource');

class TestResource extends Resource {
    static mock = {}

    id() {
        if (TestResource.mock.id) {
            return TestResource.mock.id();
        }
        return super.id();
    }

    updateStatus(event) {
        if (TestResource.mock.updateStatus) {
            return TestResource.mock.updateStatus();
        }
        return super.updateStatus(event);
    }
}

module.exports = TestResource
