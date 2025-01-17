"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerBoolean = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL booleans to RDF boolean terms.
 */
class NodeValueHandlerBoolean extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('BooleanValue', util, settings);
        this.datatype = this.util.dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#boolean');
    }
    handle(valueNode, fieldName, convertContext) {
        return { terms: [this.util.dataFactory.literal(valueNode.value ? 'true' : 'false', this.datatype)] };
    }
}
exports.NodeValueHandlerBoolean = NodeValueHandlerBoolean;
//# sourceMappingURL=NodeValueHandlerBoolean.js.map