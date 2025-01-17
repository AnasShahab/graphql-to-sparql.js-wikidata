"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerObject = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL objects to triple patterns by converting keys to predicates and values to objects.
 */
class NodeValueHandlerObject extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('ObjectValue', util, settings);
    }
    handle(valueNode, fieldName, convertContext) {
        // Convert object keys to predicates and values to objects, and link them both with a new blank node.
        const subject = this.util.dataFactory.blankNode();
        let auxiliaryObjectPatterns = [];
        for (const field of valueNode.fields) {
            const subValue = this.util.handleNodeValue(field.value, fieldName, convertContext);
            for (const term of subValue.terms) {
                auxiliaryObjectPatterns.push(this.util.createQuadPattern(subject, field.name, term, convertContext.graph, convertContext.context));
            }
            if (subValue.auxiliaryPatterns) {
                auxiliaryObjectPatterns = auxiliaryObjectPatterns.concat(subValue.auxiliaryPatterns);
            }
        }
        return { terms: [subject], auxiliaryPatterns: auxiliaryObjectPatterns };
    }
}
exports.NodeValueHandlerObject = NodeValueHandlerObject;
//# sourceMappingURL=NodeValueHandlerObject.js.map