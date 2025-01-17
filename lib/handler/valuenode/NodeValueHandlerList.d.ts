import { ListValueNode } from "graphql/language";
import * as RDF from "@rdfjs/types";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
import { IValueNodeHandlerOutput, NodeValueHandlerAdapter } from "./NodeValueHandlerAdapter";
/**
 * Converts GraphQL lists to RDF lists if settings.arraysToRdfLists is true, otherwise it converts to multiple values.
 */
export declare class NodeValueHandlerList extends NodeValueHandlerAdapter<ListValueNode> {
    protected readonly nodeFirst: RDF.NamedNode;
    protected readonly nodeRest: RDF.NamedNode;
    protected readonly nodeNil: RDF.NamedNode;
    constructor(util: Util, settings: IConvertSettings);
    handle(valueNode: ListValueNode, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
}
