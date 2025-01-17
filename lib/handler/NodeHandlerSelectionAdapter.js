"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerSelectionAdapter = void 0;
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const IConvertContext_1 = require("../IConvertContext");
const NodeHandlerAdapter_1 = require("./NodeHandlerAdapter");
/**
 * A handler for converting GraphQL selection nodes to operations.
 */
class NodeHandlerSelectionAdapter extends NodeHandlerAdapter_1.NodeHandlerAdapter {
    constructor(targetKind, util, settings) {
        super(targetKind, util, settings);
    }
    /**
     * Get the quad context of a field node that should be used for the whole definition node.
     * @param {FieldNode} field A field node.
     * @param {string} fieldLabel A field label.
     * @param {IConvertContext} convertContext A convert context.
     * @return {INodeQuadContext | null} The subject and optional auxiliary patterns.
     */
    getNodeQuadContextFieldNode(field, fieldLabel, convertContext) {
        return this.getNodeQuadContextSelectionSet(field.selectionSet, fieldLabel, Object.assign(Object.assign({}, convertContext), { path: this.util.appendFieldToPath(convertContext.path, fieldLabel) }));
    }
    /**
     * Convert a field node to an operation.
     * @param {IConvertContext} convertContext A convert context.
     * @param {FieldNode} fieldNode The field node to convert.
     * @param {boolean} pushTerminalVariables If terminal variables should be created.
     * @param {Pattern[]} auxiliaryPatterns Optional patterns that should be part of the BGP.
     * @return {Operation} The reslting operation.
     */
    fieldToOperation(convertContext, fieldNode, pushTerminalVariables, auxiliaryPatterns) {
        // If a deeper node is being selected, and if the current object should become the next subject
        const nesting = pushTerminalVariables;
        // Offset and limit can be changed using the magic arguments 'first' and 'offset'.
        let offset = 0;
        let limit;
        // Ignore 'id' and 'graph' fields, because we have processed them earlier in getNodeQuadContextSelectionSet.
        if (fieldNode.name.value === 'id' || fieldNode.name.value === 'graph') {
            pushTerminalVariables = false;
            // Validate all _-arguments, because even though they were handled before,
            // the validity of variables could not be checked,
            // as variablesMetaDict wasn't populated at that time yet.
            if (fieldNode.arguments) {
                for (const argument of fieldNode.arguments) {
                    if (argument.name.value === '_') {
                        this.util.handleNodeValue(argument.value, fieldNode.name.value, convertContext);
                    }
                }
            }
        }
        // Determine the field label for variable naming, taking into account aliases
        const fieldLabel = this.util.getFieldLabel(fieldNode);
        // Handle the singular/plural scope
        if (convertContext.singularizeState === IConvertContext_1.SingularizeState.SINGLE) {
            convertContext.singularizeVariables[this.util.nameToVariable(fieldLabel, convertContext).value] = true;
        }
        // Handle meta fields
        if (pushTerminalVariables) {
            const operationOverride = this.handleMetaField(convertContext, fieldLabel, auxiliaryPatterns);
            if (operationOverride) {
                return operationOverride;
            }
        }
        const operations = auxiliaryPatterns
            ? [this.util.operationFactory.createBgp(auxiliaryPatterns)] : [];
        // Define subject and object
        const subjectOutput = this.getNodeQuadContextFieldNode(fieldNode, fieldLabel, convertContext);
        let object = subjectOutput.subject || this.util.nameToVariable(fieldLabel, convertContext);
        let graph = subjectOutput.graph || convertContext.graph;
        if (subjectOutput.auxiliaryPatterns) {
            operations.push(this.util.operationFactory.createBgp(subjectOutput.auxiliaryPatterns));
        }
        // Check if there is a '_' argument
        // We do this before handling all other arguments so that the order of final triple patterns is sane.
        let createQuadPattern = true;
        let overrideObjectTerms = null;
        if (pushTerminalVariables && fieldNode.arguments && fieldNode.arguments.length) {
            for (const argument of fieldNode.arguments) {
                if (argument.name.value === '_') {
                    // '_'-arguments do not create an additional predicate link, but set the value directly.
                    const valueOutput = this.util.handleNodeValue(argument.value, fieldNode.name.value, convertContext);
                    overrideObjectTerms = valueOutput.terms;
                    operations.push(this.util.operationFactory.createBgp(valueOutput.terms.map((term) => this.util.createQuadPattern(convertContext.subject, fieldNode.name, term, convertContext.graph, convertContext.context))));
                    if (valueOutput.auxiliaryPatterns) {
                        operations.push(this.util.operationFactory.createBgp(subjectOutput.auxiliaryPatterns));
                    }
                    pushTerminalVariables = false;
                    break;
                }
                else if (argument.name.value === 'graph') {
                    // 'graph'-arguments do not create an additional predicate link, but set the graph.
                    const valueOutput = this.util.handleNodeValue(argument.value, fieldNode.name.value, convertContext);
                    if (valueOutput.terms.length !== 1) {
                        throw new Error(`Only single values can be set as graph, but got ${valueOutput.terms
                            .length} at ${fieldNode.name.value}`);
                    }
                    graph = valueOutput.terms[0];
                    convertContext = Object.assign(Object.assign({}, convertContext), { graph });
                    if (valueOutput.auxiliaryPatterns) {
                        operations.push(this.util.operationFactory.createBgp(subjectOutput.auxiliaryPatterns));
                    }
                    break;
                }
                else if (argument.name.value === 'alt') {
                    // 'alt'-arguments do not create an additional predicate link, but create alt-property paths.
                    let pathValue = argument.value;
                    if (pathValue.kind !== 'ListValue') {
                        pathValue = { kind: 'ListValue', values: [pathValue] };
                    }
                    operations.push(this.util.createQuadPath(convertContext.subject, fieldNode.name, pathValue, object, convertContext.graph, convertContext.context));
                    createQuadPattern = false;
                    break;
                }
            }
        }
        // Create at least a pattern for the parent node and the current path.
        if (pushTerminalVariables && createQuadPattern) {
            operations.push(this.util.operationFactory.createBgp([
                this.util.createQuadPattern(convertContext.subject, fieldNode.name, object, convertContext.graph, convertContext.context),
            ]));
        }
        // Create patterns for the node's arguments
        if (fieldNode.arguments && fieldNode.arguments.length) {
            for (const argument of fieldNode.arguments) {
                if (argument.name.value === '_' || argument.name.value === 'graph' || argument.name.value === 'alt') {
                    // no-op
                }
                else if (argument.name.value === 'first') {
                    if (argument.value.kind !== 'IntValue') {
                        throw new Error('Invalid value type for \'first\' argument: ' + argument.value.kind);
                    }
                    limit = parseInt(argument.value.value, 10);
                }
                else if (argument.name.value === 'offset') {
                    if (argument.value.kind !== 'IntValue') {
                        throw new Error('Invalid value type for \'offset\' argument: ' + argument.value.kind);
                    }
                    offset = parseInt(argument.value.value, 10);
                }
                else {
                    const valueOutput = this.util.handleNodeValue(argument.value, argument.name.value, convertContext);
                    operations.push(this.util.operationFactory.createBgp(valueOutput.terms.map((term) => this.util.createQuadPattern(object, argument.name, term, convertContext.graph, convertContext.context))));
                    if (valueOutput.auxiliaryPatterns) {
                        operations.push(this.util.operationFactory.createBgp(subjectOutput.auxiliaryPatterns));
                    }
                }
            }
        }
        // Directives
        const directiveOutputs = this.getDirectiveOutputs(fieldNode.directives, fieldLabel, convertContext);
        if (!directiveOutputs) {
            return this.util.operationFactory.createBgp([]);
        }
        // Recursive call for nested selection sets
        let operation = this.util.joinOperations(operations);
        if (fieldNode.selectionSet && fieldNode.selectionSet.selections.length) {
            // Override the object if needed
            if (overrideObjectTerms) {
                if (overrideObjectTerms.length !== 1) {
                    throw new Error(`Only single values can be set as id, but got ${overrideObjectTerms
                        .length} at ${fieldNode.name.value}`);
                }
                object = overrideObjectTerms[0];
            }
            // Change path value when there was an alias on this node.
            const subConvertContext = Object.assign(Object.assign(Object.assign({}, convertContext), nesting ? { path: this.util.appendFieldToPath(convertContext.path, fieldLabel) } : {}), { graph, subject: nesting ? object : convertContext.subject });
            // If the magic keyword 'totalCount' is present, include a count aggregator.
            let totalCount = false;
            const selections = fieldNode.selectionSet.selections
                .filter((selection) => {
                if (selection.kind === 'Field' && selection.name.value === 'totalCount') {
                    totalCount = true;
                    return false;
                }
                return true;
            });
            let joinedOperation = this.util.joinOperations(operations
                .concat(selections.map((selectionNode) => this.util.handleNode(selectionNode, subConvertContext))));
            // Modify the operation if there was a count selection
            if (totalCount) {
                // Create to a count aggregation
                const expressionVariable = this.util.dataFactory.variable('var' + this.settings.expressionVariableCounter++);
                const countOverVariable = this.util.dataFactory
                    .variable(object.value + this.settings.variableDelimiter + 'totalCount');
                const aggregator = this.util.operationFactory.createBoundAggregate(expressionVariable, 'count', this.util.operationFactory.createTermExpression(object), false);
                const countProject = this.util.operationFactory.createProject(this.util.operationFactory.createExtend(this.util.operationFactory.createGroup(operation, [], [aggregator]), countOverVariable, this.util.operationFactory.createTermExpression(expressionVariable)), [countOverVariable]);
                convertContext.terminalVariables.push(countOverVariable);
                // If no other selections exist (next to totalCount),
                // then we just return the count operations as-is,
                // otherwise, we join the count operation with all other selections
                if (!selections.length) {
                    joinedOperation = countProject;
                }
                else {
                    joinedOperation = this.util.operationFactory.createJoin(this.util.operationFactory.createProject(joinedOperation, []), countProject);
                }
            }
            operation = joinedOperation;
        }
        else if (pushTerminalVariables && object.termType === 'Variable') {
            // If no nested selection sets exist,
            // consider the object variable as a terminal variable that should be selected.
            convertContext.terminalVariables.push(object);
        }
        // Wrap the operation in a slice if a 'first' or 'offset' argument was provided.
        if (offset || limit) {
            operation = this.util.operationFactory.createSlice(this.util.operationFactory.createProject(operation, sparqlalgebrajs_1.Util.inScopeVariables(operation)), offset, limit);
        }
        // Override operation if needed
        return this.handleDirectiveOutputs(directiveOutputs, operation);
    }
    /**
     * Check if the given node is a meta field, for things like introspection.
     * If so, return a new operation for this, otherwise, null is returned.
     * @param {IConvertContext} convertContext A convert context.
     * @param {Term} subject The subject.
     * @param {string} fieldLabel The field label to convert.
     * @param {Pattern[]} auxiliaryPatterns Optional patterns that should be part of the BGP.
     * @return {Operation} An operation or null.
     */
    handleMetaField(convertContext, fieldLabel, auxiliaryPatterns) {
        // TODO: in the future, we should add support for GraphQL wide range of introspection features:
        // http://graphql.org/learn/introspection/
        if (fieldLabel === '__typename') {
            const object = this.util.nameToVariable(fieldLabel, convertContext);
            convertContext.terminalVariables.push(object);
            return this.util.operationFactory.createBgp([
                this.util.operationFactory.createPattern(convertContext.subject, this.util.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), this.util.nameToVariable(fieldLabel, convertContext), convertContext.graph),
                // this.util.operationFactory.createPattern(convertContext.subject, this.util.dataFactory.namedNode('http://www.wikidata.org/prop/direct/P31'), this.util.nameToVariable(fieldLabel, convertContext), convertContext.graph),
            ].concat(auxiliaryPatterns || []));
        }
        return null;
    }
}
exports.NodeHandlerSelectionAdapter = NodeHandlerSelectionAdapter;
//# sourceMappingURL=NodeHandlerSelectionAdapter.js.map