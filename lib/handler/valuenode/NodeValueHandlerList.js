"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerList = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL lists to RDF lists if settings.arraysToRdfLists is true, otherwise it converts to multiple values.
 */
class NodeValueHandlerList extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('ListValue', util, settings);
        this.nodeFirst = this.util.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first');
        this.nodeRest = this.util.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest');
        this.nodeNil = this.util.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil');
    }
    handle(valueNode, fieldName, convertContext) {
        const listTerms = [];
        let auxiliaryPatterns = [];
        // Create terms for list values
        for (const v of valueNode.values) {
            const subValue = this.util.handleNodeValue(v, fieldName, convertContext);
            for (const term of subValue.terms) {
                listTerms.push(term);
            }
            if (subValue.auxiliaryPatterns) {
                auxiliaryPatterns = auxiliaryPatterns.concat(subValue.auxiliaryPatterns);
            }
        }
        if (this.settings.arraysToRdfLists) {
            // Convert array to RDF list
            // Create chained list structure
            const firstListNode = this.util.dataFactory.blankNode();
            let listNode = firstListNode;
            let remaining = listTerms.length;
            for (const term of listTerms) {
                auxiliaryPatterns.push(this.util.operationFactory.createPattern(listNode, this.nodeFirst, term, convertContext.graph));
                const nextListNode = --remaining === 0 ? this.nodeNil : this.util.dataFactory.blankNode();
                auxiliaryPatterns.push(this.util.operationFactory.createPattern(listNode, this.nodeRest, nextListNode, convertContext.graph));
                listNode = nextListNode;
            }
            return { terms: [firstListNode], auxiliaryPatterns };
        }
        else {
            // Convert array to multiple terms that will be linked via the same predicate.
            return { terms: listTerms, auxiliaryPatterns };
        }
    }
}
exports.NodeValueHandlerList = NodeValueHandlerList;
//# sourceMappingURL=NodeValueHandlerList.js.map