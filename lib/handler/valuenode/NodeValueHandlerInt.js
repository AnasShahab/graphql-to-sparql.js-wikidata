"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerInt = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL ints to RDF integer terms.
 */
class NodeValueHandlerInt extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('IntValue', util, settings);
        this.datatype = this.util.dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#integer');
    }
    handle(valueNode, fieldName, convertContext) {
        return { terms: [this.util.dataFactory.literal(valueNode.value, this.datatype)] };
    }
}
exports.NodeValueHandlerInt = NodeValueHandlerInt;
//# sourceMappingURL=NodeValueHandlerInt.js.map