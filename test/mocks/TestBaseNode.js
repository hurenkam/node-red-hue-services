const BaseNode = require('../../src/nodes/BaseNode');

class TestBaseNode extends BaseNode {
    onInput(msg) {
      super.onInput(msg);
      if (this.reportInput) {
          this.reportInput(msg);
      }
    }
    getStatusFill() {
        if (this.returnStatusFill) {
            return this.returnStatusFill();
        }
        return super.getStatusFill();
    }
    getStatusText() {
        if (this.returnStatusText) {
            return this.returnStatusText();
        }
        return super.getStatusText();
    }
    getStatusShape() {
        if (this.returnStatusShape) {
            return this.returnStatusShape();
        }
        return super.getStatusShape();
    }
    status(status) {
        if (this.reportStatus) {
            this.reportStatus(status);
        }
        super.status(status);
    }
}

module.exports = TestBaseNode;
