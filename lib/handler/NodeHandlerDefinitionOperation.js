"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerDefinitionOperation = void 0;
const NodeHandlerDefinitionAdapter_1 = require("./NodeHandlerDefinitionAdapter");
/**
 * Converts GraphQL definitions to joined operations for all its selections.
 */
class NodeHandlerDefinitionOperation extends NodeHandlerDefinitionAdapter_1.NodeHandlerDefinitionAdapter {
    constructor(util, settings) {
        super('OperationDefinition', util, settings);
    }
    handle(operationDefinition, convertContext) {
        if (operationDefinition.operation !== 'query') {
            throw new Error('Unsupported definition operation: ' + operationDefinition.operation);
        }
        // We ignore the query name, as SPARQL doesn't support naming queries.
        // Variables
        if (operationDefinition.variableDefinitions) {
            for (const variableDefinition of operationDefinition.variableDefinitions) {
                const name = variableDefinition.variable.name.value;
                // Put the default value in the context if it hasn't been defined yet.
                if (variableDefinition.defaultValue) {
                    if (!convertContext.variablesDict[name]) {
                        convertContext.variablesDict[name] = variableDefinition.defaultValue;
                    }
                }
                // Handle type
                let typeNode = variableDefinition.type;
                const mandatory = typeNode.kind === 'NonNullType';
                if (mandatory) {
                    typeNode = typeNode.type;
                }
                const list = typeNode.kind === 'ListType';
                if (list) {
                    typeNode = typeNode.type;
                }
                const type = typeNode.name.value;
                convertContext.variablesMetaDict[name] = { mandatory, list, type };
            }
        }
        // Directives
        const directiveOutputs = this.getDirectiveOutputs(operationDefinition.directives, operationDefinition.name ? operationDefinition.name.value : '', convertContext);
        if (!directiveOutputs) {
            return this.util.operationFactory.createBgp([]);
        }
        // Handle the operation
        const operation = this.util.joinOperations(operationDefinition.selectionSet.selections
            .map((selectionNode) => this.util.handleNode(selectionNode, convertContext)));
        // Override operation if needed
        return this.handleDirectiveOutputs(directiveOutputs, operation);
    }
}
exports.NodeHandlerDefinitionOperation = NodeHandlerDefinitionOperation;
//# sourceMappingURL=NodeHandlerDefinitionOperation.js.map