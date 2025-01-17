"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerSelectionFragmentSpread = void 0;
const NodeHandlerSelectionAdapter_1 = require("./NodeHandlerSelectionAdapter");
/**
 * Converts GraphQL fragment spread to one or more quad patterns with a given type within an optional.
 */
class NodeHandlerSelectionFragmentSpread extends NodeHandlerSelectionAdapter_1.NodeHandlerSelectionAdapter {
    constructor(util, settings) {
        super('FragmentSpread', util, settings);
    }
    handle(fragmentSpreadNode, convertContext) {
        const fragmentDefinitionNode = convertContext
            .fragmentDefinitions[fragmentSpreadNode.name.value];
        if (!fragmentDefinitionNode) {
            throw new Error('Undefined fragment definition: ' + fragmentSpreadNode.name.value);
        }
        // Wrap in an OPTIONAL, as this pattern should only apply if the type applies
        const fieldNode = {
            alias: null,
            arguments: null,
            directives: fragmentDefinitionNode.directives,
            kind: 'Field',
            name: fragmentSpreadNode.name,
            selectionSet: fragmentDefinitionNode.selectionSet,
        };
        const auxiliaryPatterns = [
            this.util.newTypePattern(convertContext.subject, fragmentDefinitionNode.typeCondition, convertContext),
        ];
        return this.util.operationFactory.createLeftJoin(this.util.operationFactory.createBgp([]), this.fieldToOperation(convertContext, fieldNode, false, auxiliaryPatterns));
    }
}
exports.NodeHandlerSelectionFragmentSpread = NodeHandlerSelectionFragmentSpread;
//# sourceMappingURL=NodeHandlerSelectionFragmentSpread.js.map