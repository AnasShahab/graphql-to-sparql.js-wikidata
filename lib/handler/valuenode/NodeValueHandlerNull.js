"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerNull = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL nulls to RDF nil terms.
 */
class NodeValueHandlerNull extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('NullValue', util, settings);
        this.nil = this.util.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil');
    }
    handle(valueNode, fieldName, convertContext) {
        return { terms: [this.nil] };
    }
}
exports.NodeValueHandlerNull = NodeValueHandlerNull;
//# sourceMappingURL=NodeValueHandlerNull.js.map