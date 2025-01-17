"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerEnum = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL enums to RDF named nodes.
 */
class NodeValueHandlerEnum extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('EnumValue', util, settings);
    }
    handle(valueNode, fieldName, convertContext) {
        return { terms: [this.util.valueToNamedNode(valueNode.value, convertContext.context)] };
    }
}
exports.NodeValueHandlerEnum = NodeValueHandlerEnum;
//# sourceMappingURL=NodeValueHandlerEnum.js.map