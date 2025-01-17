import { NullValueNode } from "graphql/language";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
import { IValueNodeHandlerOutput, NodeValueHandlerAdapter } from "./NodeValueHandlerAdapter";
import * as RDF from "@rdfjs/types";
/**
 * Converts GraphQL nulls to RDF nil terms.
 */
export declare class NodeValueHandlerNull extends NodeValueHandlerAdapter<NullValueNode> {
    protected readonly nil: RDF.NamedNode;
    constructor(util: Util, settings: IConvertSettings);
    handle(valueNode: NullValueNode, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
}
