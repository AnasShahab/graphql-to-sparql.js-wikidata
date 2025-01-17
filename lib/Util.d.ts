import { ArgumentNode, FieldNode, ListValueNode, NamedTypeNode, NameNode, ValueNode } from "graphql/language";
import { ContextParser, JsonLdContextNormalized } from "jsonld-context-parser";
import * as RDF from "@rdfjs/types";
import { Algebra, Factory } from "sparqlalgebrajs";
import { IValueNodeHandlerOutput, NodeHandlerAdapter, NodeValueHandlerAdapter } from "./handler";
import { IConvertContext } from "./IConvertContext";
import { IConvertSettings } from "./IConvertSettings";
import { DirectiveNodeHandlerAdapter, IDirectiveContext, IDirectiveNodeHandlerOutput } from "./handler/directivenode/DirectiveNodeHandlerAdapter";
/**
 * Utilities for conversion.
 */
export declare class Util {
    readonly dataFactory: RDF.DataFactory;
    readonly operationFactory: Factory;
    readonly contextParser: ContextParser;
    protected readonly settings: IConvertSettings;
    private readonly nodeHandlers;
    private readonly nodeValueHandlers;
    private readonly directiveNodeHandlers;
    constructor(settings: IConvertSettings);
    /**
     * Register a new {@link NodeHandlerAdapter}.
     * @param {NodeHandlerAdapter<any>} nodeHandler A handler for converting GraphQL nodes to operations.
     */
    registerNodeHandler(nodeHandler: NodeHandlerAdapter<any>): void;
    /**
     * Register a new {@link NodeValueHandlerAdapter}
     * @param {NodeValueHandlerAdapter<any>} nodeValueHandler A handler for converting GraphQL value nodes
     *                                                        to terms and patterns.
     */
    registerNodeValueHandler(nodeValueHandler: NodeValueHandlerAdapter<any>): void;
    /**
     * Register a new {@link DirectiveNodeHandlerAdapter}
     * @param {DirectiveNodeHandlerAdapter} directiveNodeHandler A handler for handling GraphQL directives.
     */
    registerDirectiveNodeHandler(directiveNodeHandler: DirectiveNodeHandlerAdapter): void;
    /**
     * Get the operation for the given GraphQL node.
     * @param {T} node A GraphQL node.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {Operation} A SPARQL algebra operation.
     */
    handleNode<T extends {
        kind: string;
    }>(node: T, convertContext: IConvertContext): Algebra.Operation;
    /**
     * Get the terms and patterns for the given value node.
     * @param {T} node A GraphQL node.
     * @param {string} fieldName The name of the field or argument in which the value was encapsulated.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {IValueNodeHandlerOutput} The RDF terms and patterns.
     */
    handleNodeValue<T extends ValueNode>(node: T, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
    /**
     * Get the handler output for the given directive.
     * @param {IDirectiveContext} directiveContext The current directive context.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {IDirectiveNodeHandlerOutput} The directive node handler output or null.
     */
    handleDirectiveNode(directiveContext: IDirectiveContext, convertContext: IConvertContext): IDirectiveNodeHandlerOutput;
    /**
     * Join the given array of operations.
     * If all operations are BGPs, then a single big BGP with all patterns from the given BGPs will be created.
     * @param {Operation[]} operations An array of operations.
     * @return {Operation} A single joined operation.
     */
    joinOperations(operations: Algebra.Operation[]): Algebra.Operation;
    joinOperationsAsBgp(operations: Algebra.Operation[]): Algebra.Operation;
    joinOperationsAsNestedJoin(operations: Algebra.Operation[]): Algebra.Operation;
    /**
     * Append a field's label to a path.
     * @param {string[]} path A path.
     * @param {string} fieldLabel A field label.
     * @return {string[]} A new path array.
     */
    appendFieldToPath(path: string[], fieldLabel: string): string[];
    /**
     * Get the label of a field by taking into account the alias.
     * @param {FieldNode} field A field node.
     * @return {string} The field name or alias.
     */
    getFieldLabel(field: FieldNode): string;
    /**
     * Convert a field node to a variable built from the node name and the current path inside the context.
     * @param {string} fieldLabel A field label.
     * @param {IConvertContext} convertContext A convert context.
     * @param {string} variableDelimiter A variable delimiter.
     * @return {Variable} A variable.
     */
    nameToVariable(fieldLabel: string, convertContext: IConvertContext): RDF.Variable;
    /**
     * Convert a GraphQL term into a URI using the given context.
     * @param {string} value A GraphQL term.
     * @param {IContext} context A JSON-LD context.
     * @return {NamedNode} A named node.
     */
    valueToNamedNode(value: string, context: JsonLdContextNormalized): RDF.NamedNode;
    /**
     * Get an argument by name.
     * This will return null if the argument could not be found.
     * @param {ReadonlyArray<ArgumentNode>} args Arguments or null.
     * @param {string} name The name of an argument.
     * @return {ArgumentNode} The named argument.
     */
    getArgument(args: ReadonlyArray<ArgumentNode> | null, name: string): ArgumentNode;
    /**
     * Create a pattern with an rdf:type predicate.
     * @param {Term} subject The subject.
     * @param {NamedTypeNode} typeCondition The object name.
     * @param {IConvertContext} convertContext A convert context.
     * @return {Pattern} A pattern.
     */
    newTypePattern(subject: RDF.Term, typeCondition: NamedTypeNode, convertContext: IConvertContext): Algebra.Pattern;
    /**
     * Create a quad pattern when the predicate is a name node that needs to be translated using the context.
     * @param {Term} subject The subject.
     * @param {NameNode} predicateName The name node for the predicate.
     * @param {Term} object The object.
     * @param {Term} graph The graph.
     * @param {IContext} context A context.
     * @return {Pattern} A quad pattern.
     */
    createQuadPattern(subject: RDF.Term, predicateName: NameNode, object: RDF.Term, graph: RDF.Term, context: JsonLdContextNormalized): Algebra.Pattern;
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
    createQuadPath(subject: RDF.Term, predicateName: NameNode, predicateAlternatives: ListValueNode, object: RDF.Term, graph: RDF.Term, context: JsonLdContextNormalized): Algebra.Path;
}
