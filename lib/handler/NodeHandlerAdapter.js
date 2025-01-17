"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerAdapter = void 0;
/**
 * A handler for converting GraphQL nodes to operations.
 */
class NodeHandlerAdapter {
    constructor(targetKind, util, settings) {
        this.targetKind = targetKind;
        this.util = util;
        this.settings = settings;
    }
    /* ----- Node quad context ----- */
    /**
     * Get the quad context of a selection set node that should be used for the whole definition node.
     *
     * This is a pre-processing step of selection sets.
     * Its only purpose is to determine the subject within a selection set,
     * because this subject is needed to link with its parent.
     * In a later phase, the selection set will be processed using the discovered subject,
     * and the field identifying the subject will be ignored.
     *
     * @param {SelectionSetNode} selectionSet A selection set node.
     * @param {string} fieldLabel A field label.
     * @param {IConvertContext} convertContext A convert context.
     * @return {INodeQuadContext} The subject, graph and auxiliary patterns.
     */
    getNodeQuadContextSelectionSet(selectionSet, fieldLabel, convertContext) {
        const nodeQuadContext = {};
        if (selectionSet) {
            for (const selectionNode of selectionSet.selections) {
                if (selectionNode.kind === 'Field') {
                    const fieldNode = selectionNode;
                    this.handleNodeQuadContextField(fieldNode, convertContext, nodeQuadContext, 'id', 'subject');
                    this.handleNodeQuadContextField(fieldNode, convertContext, nodeQuadContext, 'graph', 'graph');
                }
            }
        }
        return nodeQuadContext;
    }
    /**
     * Handles a single field for determining the node quad context.
     * @param {FieldNode} fieldNode A field node.
     * @param {IConvertContext} convertContext A convert context.
     * @param {INodeQuadContext} nodeQuadContext The node quad context to populate.
     * @param {string} fieldName The field name to check for.
     * @param {'subject' | 'graph'} nodeQuadContextKey The key to fill into the node quad context.
     */
    handleNodeQuadContextField(fieldNode, convertContext, nodeQuadContext, fieldName, nodeQuadContextKey) {
        if (!nodeQuadContext[nodeQuadContextKey] && fieldNode.name.value === fieldName) {
            // Get (or set) the nodeQuadContextKey for fieldName fields
            if (!nodeQuadContext[nodeQuadContextKey]) {
                const argument = this.util.getArgument(fieldNode.arguments, '_');
                if (argument) {
                    const valueOutput = this.util.handleNodeValue(argument.value, fieldNode.name.value, convertContext);
                    if (valueOutput.terms.length !== 1) {
                        throw new Error(`Only single values can be set as ${fieldName}, but got ${valueOutput.terms
                            .length} at ${fieldNode.name.value}`);
                    }
                    nodeQuadContext[nodeQuadContextKey] = valueOutput.terms[0];
                    if (valueOutput.auxiliaryPatterns) {
                        if (!nodeQuadContext.auxiliaryPatterns) {
                            nodeQuadContext.auxiliaryPatterns = [];
                        }
                        nodeQuadContext.auxiliaryPatterns.concat(valueOutput.auxiliaryPatterns);
                    }
                }
            }
            if (!nodeQuadContext[nodeQuadContextKey]) {
                const term = this.util.nameToVariable(this.util.getFieldLabel(fieldNode), convertContext);
                convertContext.terminalVariables.push(term);
                nodeQuadContext[nodeQuadContextKey] = term;
            }
        }
    }
    /* ----- Directives ----- */
    /**
     * Get an operation override defined by one of the directives.
     *
     * This should be called before a sub-operation is handled.
     *
     * @param {ReadonlyArray<DirectiveNode>} directives An option directives array.
     * @param {string} fieldLabel The current field label.
     * @param {IConvertContext} convertContext A convert context.
     * @return {IDirectiveNodeHandlerOutput[]} The directive node handler outputs, or null if it should be ignored.
     */
    getDirectiveOutputs(directives, fieldLabel, convertContext) {
        const outputs = [];
        if (directives) {
            for (const directive of directives) {
                const output = this.util.handleDirectiveNode({ directive, fieldLabel }, convertContext);
                if (output) {
                    if (output.ignore) {
                        return null;
                    }
                    outputs.push(output);
                }
            }
        }
        return outputs;
    }
    /**
     * Handle the directive outputs with respect to an operation.
     *
     * This should be called after a sub-operation was handled.
     *
     * @param {IDirectiveNodeHandlerOutput[]} directiveOutputs
     * @param {Operation} operation
     * @return {Operation}
     */
    handleDirectiveOutputs(directiveOutputs, operation) {
        for (const directiveOutput of directiveOutputs) {
            if (directiveOutput.ignore) {
                return this.util.operationFactory.createBgp([]);
            }
            if (directiveOutput.operationOverrider) {
                operation = directiveOutput.operationOverrider(operation);
            }
        }
        return operation;
    }
}
exports.NodeHandlerAdapter = NodeHandlerAdapter;
//# sourceMappingURL=NodeHandlerAdapter.js.map