"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerString = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL strings to RDF string terms, which can have a custom language or datatype.
 */
class NodeValueHandlerString extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('StringValue', util, settings);
    }
    handle(valueNode, fieldName, convertContext) {
        const contextEntry = convertContext.context.getContextRaw()[fieldName];
        let language = null;
        let datatype = null;
        if (contextEntry && typeof contextEntry !== 'string') {
            if (contextEntry['@language']) {
                language = contextEntry['@language'];
            }
            else if (contextEntry['@type']) {
                datatype = this.util.dataFactory.namedNode(contextEntry['@type']);
            }
        }
        return { terms: [this.util.dataFactory.literal(valueNode.value, language || datatype)] };
    }
}
exports.NodeValueHandlerString = NodeValueHandlerString;
//# sourceMappingURL=NodeValueHandlerString.js.map