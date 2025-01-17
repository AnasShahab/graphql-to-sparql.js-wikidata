import { DirectiveNode, FieldNode, SelectionSetNode } from "graphql/language";
import * as RDF from "@rdfjs/types";
import { Algebra } from "sparqlalgebrajs";
import { IConvertContext } from "../IConvertContext";
import { IConvertSettings } from "../IConvertSettings";
import { Util } from "../Util";
import { IDirectiveNodeHandlerOutput } from "./directivenode/DirectiveNodeHandlerAdapter";
/**
 * A handler for converting GraphQL nodes to operations.
 */
export declare abstract class NodeHandlerAdapter<T extends {
    kind: string;
}> {
    readonly targetKind: string;
    protected readonly util: Util;
    protected readonly settings: IConvertSettings;
    constructor(targetKind: T['kind'], util: Util, settings: IConvertSettings);
    /**
     * Get the operation for the given GraphQL node.
     * @param {T} node A GraphQL node.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {Operation} A SPARQL algebra operation.
     */
    abstract handle(node: T, convertContext: IConvertContext): Algebra.Operation;
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
    getNodeQuadContextSelectionSet(selectionSet: SelectionSetNode | null, fieldLabel: string, convertContext: IConvertContext): INodeQuadContext;
    /**
     * Handles a single field for determining the node quad context.
     * @param {FieldNode} fieldNode A field node.
     * @param {IConvertContext} convertContext A convert context.
     * @param {INodeQuadContext} nodeQuadContext The node quad context to populate.
     * @param {string} fieldName The field name to check for.
     * @param {'subject' | 'graph'} nodeQuadContextKey The key to fill into the node quad context.
     */
    handleNodeQuadContextField(fieldNode: FieldNode, convertContext: IConvertContext, nodeQuadContext: INodeQuadContext, fieldName: string, nodeQuadContextKey: 'subject' | 'graph'): void;
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
    getDirectiveOutputs(directives: ReadonlyArray<DirectiveNode> | null, fieldLabel: string, convertContext: IConvertContext): IDirectiveNodeHandlerOutput[];
    /**
     * Handle the directive outputs with respect to an operation.
     *
     * This should be called after a sub-operation was handled.
     *
     * @param {IDirectiveNodeHandlerOutput[]} directiveOutputs
     * @param {Operation} operation
     * @return {Operation}
     */
    handleDirectiveOutputs(directiveOutputs: IDirectiveNodeHandlerOutput[], operation: Algebra.Operation): Algebra.Operation;
}
/**
 * The output of getting a node's quad context.
 */
export interface INodeQuadContext {
    subject?: RDF.Term;
    graph?: RDF.Term;
    auxiliaryPatterns?: Algebra.Pattern[];
}
