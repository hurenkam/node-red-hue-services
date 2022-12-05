const ResourceNode = require('../../src/nodes/ResourceNode');

class TestResourceNode extends ResourceNode {
    static mock = { };

    bridge() {
        if (TestResourceNode.mock.bridge) {
            return TestResourceNode.mock.bridge();
        }
        return super.bridge();
    }
    updateStatus() {
        if (TestResourceNode.mock.updateStatus) {
            return TestResourceNode.mock.updateStatus();
        }
        return super.updateStatus();
    }
}

module.exports = TestResourceNode;
