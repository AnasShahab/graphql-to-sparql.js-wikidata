import { DirectiveNode } from "graphql";
import * as RDF from "@rdfjs/types";
import { Algebra } from "sparqlalgebrajs";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
/**
 * An abstract handler for GraphQL directives.
 */
export declare abstract class DirectiveNodeHandlerAdapter {
    readonly targetKind: string;
    protected readonly util: Util;
    protected readonly settings: IConvertSettings;
    constructor(targetKind: string, util: Util, settings: IConvertSettings);
    /**
     * Get the handler output for the given directive.
     * @param {IDirectiveContext} directiveContext The current directive context.
     * @param {IConvertContext} convertContext A conversion context.
     * @return {IValueNodeHandlerOutput} The RDF terms and patterns.
     */
    abstract handle(directiveContext: IDirectiveContext, convertContext: IConvertContext): IDirectiveNodeHandlerOutput;
    /**
     * Get the value of the 'if' argument in a directive.
     * @param {DirectiveNode} directive A directive.
     * @param {IConvertContext} convertContext A convert context.
     * @return {Term} The term.
     */
    getDirectiveConditionalValue(directive: DirectiveNode, convertContext: IConvertContext): RDF.Term;
    /**
     * If a `scope: all` directive param is present.
     * @param {DirectiveNode} directive A directive.
     * @return {boolean} If `scope: all` is present.
     */
    isDirectiveScopeAll(directive: DirectiveNode): boolean;
}
/**
 * The output of converting a directive node to an operation.
 */
export interface IDirectiveNodeHandlerOutput {
    /**
     * If the field should be ignored.
     */
    ignore?: boolean;
    /**
     * The optional operation overrider.
     */
    operationOverrider?: (operation: Algebra.Operation) => Algebra.Operation;
}
export interface IDirectiveContext {
    /**
     * The current directive.
     */
    directive: DirectiveNode;
    /**
     * The current field label.
     */
    fieldLabel: string;
}
