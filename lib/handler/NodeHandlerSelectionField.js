"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerSelectionField = void 0;
const NodeHandlerSelectionAdapter_1 = require("./NodeHandlerSelectionAdapter");
/**
 * Converts GraphQL fields to one or more quad patterns.
 */
class NodeHandlerSelectionField extends NodeHandlerSelectionAdapter_1.NodeHandlerSelectionAdapter {
    constructor(util, settings) {
        super('Field', util, settings);
    }
    handle(fieldNode, convertContext) {
        return this.fieldToOperation(convertContext, fieldNode, true);
    }
}
exports.NodeHandlerSelectionField = NodeHandlerSelectionField;
//# sourceMappingURL=NodeHandlerSelectionField.js.map