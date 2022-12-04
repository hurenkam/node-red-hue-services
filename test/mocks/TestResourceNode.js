const ResourceNode = require('../../src/nodes/ResourceNode');

class TestResourceNode extends ResourceNode {
    static mock = { };

    bridge() {
        if (TestResourceNode.mock.bridge) {
            return TestResourceNode.mock.bridge();
        }
        return super.bridge();
    }
}

module.exports = TestResourceNode;
