import { BooleanValueNode } from "graphql/language";
import * as RDF from "@rdfjs/types";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
import { IValueNodeHandlerOutput, NodeValueHandlerAdapter } from "./NodeValueHandlerAdapter";
/**
 * Converts GraphQL booleans to RDF boolean terms.
 */
export declare class NodeValueHandlerBoolean extends NodeValueHandlerAdapter<BooleanValueNode> {
    protected readonly datatype: RDF.NamedNode;
    constructor(util: Util, settings: IConvertSettings);
    handle(valueNode: BooleanValueNode, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
}
