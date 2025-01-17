"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerFloat = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL floats to RDF float terms.
 */
class NodeValueHandlerFloat extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('FloatValue', util, settings);
        this.datatype = this.util.dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#float');
    }
    handle(valueNode, fieldName, convertContext) {
        return { terms: [this.util.dataFactory.literal(valueNode.value, this.datatype)] };
    }
}
exports.NodeValueHandlerFloat = NodeValueHandlerFloat;
//# sourceMappingURL=NodeValueHandlerFloat.js.map