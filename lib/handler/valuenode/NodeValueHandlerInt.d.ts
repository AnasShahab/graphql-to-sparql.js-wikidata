import { IntValueNode } from "graphql/language";
import { IConvertContext } from "../../IConvertContext";
import { IConvertSettings } from "../../IConvertSettings";
import { Util } from "../../Util";
import { IValueNodeHandlerOutput, NodeValueHandlerAdapter } from "./NodeValueHandlerAdapter";
import * as RDF from "@rdfjs/types";
/**
 * Converts GraphQL ints to RDF integer terms.
 */
export declare class NodeValueHandlerInt extends NodeValueHandlerAdapter<IntValueNode> {
    protected readonly datatype: RDF.NamedNode;
    constructor(util: Util, settings: IConvertSettings);
    handle(valueNode: IntValueNode, fieldName: string, convertContext: IConvertContext): IValueNodeHandlerOutput;
}
