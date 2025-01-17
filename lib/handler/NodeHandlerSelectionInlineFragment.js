"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerSelectionInlineFragment = void 0;
const NodeHandlerSelectionAdapter_1 = require("./NodeHandlerSelectionAdapter");
/**
 * Converts GraphQL inline fragment to one or more quad patterns with a given type within an optional.
 */
class NodeHandlerSelectionInlineFragment extends NodeHandlerSelectionAdapter_1.NodeHandlerSelectionAdapter {
    constructor(util, settings) {
        super('InlineFragment', util, settings);
    }
    handle(inlineFragmentNode, convertContext) {
        // Wrap in an OPTIONAL, as this pattern should only apply if the type applies
        const fieldNode = {
            alias: null,
            arguments: null,
            directives: inlineFragmentNode.directives,
            kind: 'Field',
            name: { kind: 'Name', value: convertContext.subject.value },
            selectionSet: inlineFragmentNode.selectionSet,
        };
        const auxiliaryPatterns = inlineFragmentNode.typeCondition
            ? [this.util.newTypePattern(convertContext.subject, inlineFragmentNode.typeCondition, convertContext)] : [];
        return this.util.operationFactory.createLeftJoin(this.util.operationFactory.createBgp([]), this.fieldToOperation(convertContext, fieldNode, false, auxiliaryPatterns));
    }
}
exports.NodeHandlerSelectionInlineFragment = NodeHandlerSelectionInlineFragment;
//# sourceMappingURL=NodeHandlerSelectionInlineFragment.js.map