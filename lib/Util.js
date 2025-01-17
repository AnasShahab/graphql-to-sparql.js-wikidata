"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const rdf_data_factory_1 = require("rdf-data-factory");
const jsonld_context_parser_1 = require("jsonld-context-parser");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * Utilities for conversion.
 */
class Util {
    constructor(settings) {
        this.nodeHandlers = {};
        this.nodeValueHandlers = {};
        this.directiveNodeHandlers = {};
        this.settings = settings;
        this.dataFactory = settings.dataFactory || new rdf_data_factory_1.DataFactory();
        this.operationFactory = new sparqlalgebrajs_1.Factory(this.dataFactory);
        this.contextParser = new jsonld_context_parser_1.ContextParser();
    }
    /**
     * Register a new {@link NodeHandlerAdapter}.
     * @param {NodeHandlerAdapter<any>} nodeHandler A handler for converting GraphQL nodes to operations.
     */
    registerNodeHandler(nodeHandler) {
        this.nodeHandlers[nodeHandler.targetKind] = nodeHandler;
    }
    /**
     * Register a new {@link NodeValueHandlerAdapter}
     * @param {NodeValueHandlerAdapter<any>} nodeValueHandler A handler for converting GraphQL value nodes
     *                                                        to terms and patterns.
     */
    registerNodeValueHandler(nodeValueHandler) {
        this.nodeValueHandlers[nodeValueHandler.targetKind] = nodeValueHandler;
    }
    /**
     * Register a new {@link DirectiveNodeHandlerAdapter}
     * @param {DirectiveNodeHandlerAdapter} directiveNodeHandler A handler for handling GraphQL directives.
     */
    registerDirectiveNodeHandler(directiveNodeHandler) {
        this.directiveNodeHandlers[directiveNodeHandler.targetKind] = directiveNodeHandler;
    }
    /**
     * Get the operation for the given GraphQL node.
     * @param {T} node A GraphQL node.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {Operation} A SPARQL algebra operation.
     */
    handleNode(node, convertContext) {
        const nodeHandler = this.nodeHandlers[node.kind];
        if (!nodeHandler) {
            throw new Error(`Unsupported GraphQL node '${node.kind}'`);
        }
        return nodeHandler.handle(node, convertContext);
    }
    /**
     * Get the terms and patterns for the given value node.
     * @param {T} node A GraphQL node.
     * @param {string} fieldName The name of the field or argument in which the value was encapsulated.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {IValueNodeHandlerOutput} The RDF terms and patterns.
     */
    handleNodeValue(node, fieldName, convertContext) {
        const nodeValueHandler = this.nodeValueHandlers[node.kind];
        if (!nodeValueHandler) {
            throw new Error(`Unsupported GraphQL value node '${node.kind}'`);
        }
        return nodeValueHandler.handle(node, fieldName, convertContext);
    }
    /**
     * Get the handler output for the given directive.
     * @param {IDirectiveContext} directiveContext The current directive context.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {IDirectiveNodeHandlerOutput} The directive node handler output or null.
     */
    handleDirectiveNode(directiveContext, convertContext) {
        const directiveNodeHandler = this.directiveNodeHandlers[directiveContext.directive.name.value];
        if (!directiveNodeHandler) {
            return null;
        }
        return directiveNodeHandler.handle(directiveContext, convertContext);
    }
    /**
     * Join the given array of operations.
     * If all operations are BGPs, then a single big BGP with all patterns from the given BGPs will be created.
     * @param {Operation[]} operations An array of operations.
     * @return {Operation} A single joined operation.
     */
    joinOperations(operations) {
        if (operations.length === 1) {
            return operations[0];
        }
        // Check if which operations are BGPs
        const bgps = [];
        const nonBgps = [];
        for (const operation of operations) {
            if (operation.type === 'bgp') {
                bgps.push(operation);
            }
            else {
                nonBgps.push(operation);
            }
        }
        if (bgps.length === operations.length) {
            // Create a big BGP from all BGPs
            return this.joinOperationsAsBgp(bgps);
        }
        else if (bgps.length === operations.length - 1
            && nonBgps[0].type === 'leftjoin'
            && nonBgps[0].left.type === 'bgp') {
            // Check if we have one left-join (with a BGP on the left), and the rest are BGPs.
            // If so, merge the BGPS within the left-hand-side of the left-join.
            const originalLeftJoin = nonBgps[0];
            bgps.push(originalLeftJoin.left);
            return this.operationFactory.createLeftJoin(this.joinOperationsAsBgp(bgps), originalLeftJoin.right);
        }
        else if (nonBgps.length === operations.length) {
            // Create nested joins
            return this.joinOperationsAsNestedJoin(nonBgps);
        }
        else {
            // Join as much BGPs together as possible, and join with the other operations
            return this.joinOperationsAsNestedJoin([
                this.joinOperationsAsBgp(bgps),
                this.joinOperationsAsNestedJoin(nonBgps),
            ]);
        }
    }
    joinOperationsAsBgp(operations) {
        return this.operationFactory.createBgp([].concat.apply([], operations
            .map((op) => op.patterns)));
    }
    joinOperationsAsNestedJoin(operations) {
        return operations.reverse().reduce((prev, cur) => prev ? this.operationFactory.createJoin(cur, prev) : cur, null);
    }
    /**
     * Append a field's label to a path.
     * @param {string[]} path A path.
     * @param {string} fieldLabel A field label.
     * @return {string[]} A new path array.
     */
    appendFieldToPath(path, fieldLabel) {
        return path.concat([fieldLabel]);
    }
    /**
     * Get the label of a field by taking into account the alias.
     * @param {FieldNode} field A field node.
     * @return {string} The field name or alias.
     */
    getFieldLabel(field) {
        return (field.alias ? field.alias : field.name).value;
    }
    /**
     * Convert a field node to a variable built from the node name and the current path inside the context.
     * @param {string} fieldLabel A field label.
     * @param {IConvertContext} convertContext A convert context.
     * @param {string} variableDelimiter A variable delimiter.
     * @return {Variable} A variable.
     */
    nameToVariable(fieldLabel, convertContext) {
        return this.dataFactory.variable((convertContext.path.length
            ? convertContext.path.join(this.settings.variableDelimiter) + this.settings.variableDelimiter : '') + fieldLabel);
    }
    /**
     * Convert a GraphQL term into a URI using the given context.
     * @param {string} value A GraphQL term.
     * @param {IContext} context A JSON-LD context.
     * @return {NamedNode} A named node.
     */
    valueToNamedNode(value, context) {
        const contextValue = context.expandTerm(value, true);
        if (this.settings.requireContext && !contextValue) {
            throw new Error('No context entry was found for ' + value);
        }
        return this.dataFactory.namedNode(contextValue || value);
    }
    /**
     * Get an argument by name.
     * This will return null if the argument could not be found.
     * @param {ReadonlyArray<ArgumentNode>} args Arguments or null.
     * @param {string} name The name of an argument.
     * @return {ArgumentNode} The named argument.
     */
    getArgument(args, name) {
        if (args) {
            for (const argument of args) {
                if (argument.name.value === name) {
                    return argument;
                }
            }
        }
        return null;
    }
    /**
     * Create a pattern with an rdf:type predicate.
     * @param {Term} subject The subject.
     * @param {NamedTypeNode} typeCondition The object name.
     * @param {IConvertContext} convertContext A convert context.
     * @return {Pattern} A pattern.
     */
    newTypePattern(subject, typeCondition, convertContext) {
        // return this.operationFactory.createPattern(subject, this.dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), this.valueToNamedNode(typeCondition.name.value, convertContext.context), convertContext.graph);
        return this.operationFactory.createPattern(subject, this.dataFactory.namedNode('http://www.wikidata.org/prop/direct/P31'), this.valueToNamedNode(typeCondition.name.value, convertContext.context), convertContext.graph);
    }
    /**
     * Create a quad pattern when the predicate is a name node that needs to be translated using the context.
     * @param {Term} subject The subject.
     * @param {NameNode} predicateName The name node for the predicate.
     * @param {Term} object The object.
     * @param {Term} graph The graph.
     * @param {IContext} context A context.
     * @return {Pattern} A quad pattern.
     */
    createQuadPattern(subject, predicateName, object, graph, context) {
        const predicate = this.valueToNamedNode(predicateName.value, context);
        if (context && context.getContextRaw()[predicateName.value]
            && context.getContextRaw()[predicateName.value]['@reverse']) {
            return this.operationFactory.createPattern(object, predicate, subject, graph);
        }
        return this.operationFactory.createPattern(subject, predicate, object, graph);
    }
    /**
     * Create a quad path when the predicate is a list node with field alternatives
     * that need to be translated using the context.
     * @param {Term} subject The subject.
     * @param {NameNode} predicateName The name node for the predicate.
     * @param {Term} object The object.
     * @param {Term} graph The graph.
     * @param {IContext} context A context.
     * @return {Path} A quad property path.
     */
    createQuadPath(subject, predicateName, predicateAlternatives, object, graph, context) {
        const predicateInitial = this.valueToNamedNode(predicateName.value, context);
        let pathSymbol = this.operationFactory.createLink(predicateInitial);
        // Add all fields in the list as predicate alternatives
        for (const predicateAlternative of predicateAlternatives.values) {
            if (predicateAlternative.kind !== 'EnumValue') {
                throw new Error('Invalid value type for \'alt\' argument, must be EnumValue, but got '
                    + predicateAlternative.kind);
            }
            pathSymbol = this.operationFactory.createAlt(pathSymbol, this.operationFactory.createLink(this.valueToNamedNode(predicateAlternative.value, context)));
        }
        // Reverse the path based on the initial predicate
        if (context && context.getContextRaw()[predicateName.value]
            && context.getContextRaw()[predicateName.value]['@reverse']) {
            return this.operationFactory.createPath(object, pathSymbol, subject, graph);
        }
        return this.operationFactory.createPath(subject, pathSymbol, object, graph);
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map