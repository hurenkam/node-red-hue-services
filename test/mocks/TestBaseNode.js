const BaseNode = require('../../src/nodes/BaseNode');

class TestBaseNode extends BaseNode {
    static mock = { };

    onInput(msg) {
        if (TestBaseNode.mock.onInput) {
            return TestBaseNode.mock.onInput(msg);
        }
        return super.onInput(msg);
    }
    getStatusFill() {
        if (TestBaseNode.mock.getStatusFill) {
            return TestBaseNode.mock.getStatusFill();
        }
        return super.getStatusFill();
    }
    getStatusText() {
        if (TestBaseNode.mock.getStatusText) {
            return TestBaseNode.mock.getStatusText();
        }
        return super.getStatusText();
    }
    getStatusShape() {
        if (TestBaseNode.mock.getStatusShape) {
            return TestBaseNode.mock.getStatusShape();
        }
        return super.getStatusShape();
    }
    status(status) {
        if (TestBaseNode.mock.status) {
            return TestBaseNode.mock.status(status);
        }
        return super.status(status);
    }
}

module.exports = TestBaseNode;
