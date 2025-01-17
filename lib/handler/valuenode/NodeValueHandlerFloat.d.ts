import { FloatValueNode } from "graphql/language";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
import { IValueNodeHandlerOutput, NodeValueHandlerAdapter } from "./NodeValueHandlerAdapter";
import * as RDF from "@rdfjs/types";
/**
 * Converts GraphQL floats to RDF float terms.
 */
export declare class NodeValueHandlerFloat extends NodeValueHandlerAdapter<FloatValueNode> {
    protected readonly datatype: RDF.NamedNode;
    constructor(util: Util, settings: IConvertSettings);
    handle(valueNode: FloatValueNode, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
}
