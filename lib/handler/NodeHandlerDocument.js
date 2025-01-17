"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerDocument = void 0;
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const NodeHandlerAdapter_1 = require("./NodeHandlerAdapter");
/**
 * Converts GraphQL documents to joined operations for all its definitions.
 */
class NodeHandlerDocument extends NodeHandlerAdapter_1.NodeHandlerAdapter {
    constructor(util, settings) {
        super('Document', util, settings);
    }
    handle(document, convertContext) {
        const operation = this.util.operationFactory.createProject(document.definitions
            .map((definition) => {
            const subjectOutput = this.getNodeQuadContextDefinitionNode(definition, Object.assign(Object.assign({}, convertContext), { ignoreUnknownVariables: true }));
            const queryParseContext = Object.assign(Object.assign({}, convertContext), { graph: subjectOutput.graph || convertContext.graph, subject: subjectOutput.subject || this.util.dataFactory.blankNode() });
            let definitionOperation = this.util.handleNode(definition, queryParseContext);
            if (subjectOutput && subjectOutput.auxiliaryPatterns) {
                definitionOperation = this.util.joinOperations([
                    definitionOperation,
                    this.util.operationFactory.createBgp(subjectOutput.auxiliaryPatterns),
                ]);
            }
            return definitionOperation;
        })
            .reduce((prev, current) => {
            if (!current) {
                return prev;
            }
            if (!prev) {
                return current;
            }
            return this.util.operationFactory.createUnion(prev, current);
        }, null), convertContext.terminalVariables);
        // Convert blank nodes to variables
        return this.translateBlankNodesToVariables(operation);
    }
    /**
     * Get the quad context of a definition node that should be used for the whole definition node.
     * @param {DefinitionNode} definition A definition node.
     * @param {IConvertContext} convertContext A convert context.
     * @return {INodeQuadContext | null} The subject and optional auxiliary patterns.
     */
    getNodeQuadContextDefinitionNode(definition, convertContext) {
        if (definition.kind === 'OperationDefinition') {
            return this.getNodeQuadContextSelectionSet(definition.selectionSet, definition.name ? definition.name.value : '', convertContext);
        }
        return null;
    }
    /**
     * Translates blank nodes inside the query to variables.
     * @param {Project} operation The operation to translate.
     * @return {Operation} The transformed operation.
     */
    translateBlankNodesToVariables(operation) {
        const self = this;
        const blankToVariableMapping = {};
        const variablesRaw = Array.from(operation.variables)
            .reduce((acc, variable) => {
            acc[variable.value] = true;
            return acc;
        }, {});
        return sparqlalgebrajs_1.Util.mapOperation(operation, {
            path: (op, factory) => {
                return {
                    recurse: false,
                    result: factory.createPath(blankToVariable(op.subject), op.predicate, blankToVariable(op.object), blankToVariable(op.graph)),
                };
            },
            pattern: (op, factory) => {
                return {
                    recurse: false,
                    result: factory.createPattern(blankToVariable(op.subject), blankToVariable(op.predicate), blankToVariable(op.object), blankToVariable(op.graph)),
                };
            },
        });
        function blankToVariable(term) {
            if (term.termType === 'BlankNode') {
                let variable = blankToVariableMapping[term.value];
                if (!variable) {
                    variable = sparqlalgebrajs_1.Util.createUniqueVariable(term.value, variablesRaw, self.util.dataFactory);
                    variablesRaw[variable.value] = true;
                    blankToVariableMapping[term.value] = variable;
                }
                return variable;
            }
            return term;
        }
    }
}
exports.NodeHandlerDocument = NodeHandlerDocument;
//# sourceMappingURL=NodeHandlerDocument.js.map