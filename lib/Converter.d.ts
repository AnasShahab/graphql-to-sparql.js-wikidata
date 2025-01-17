import { DocumentNode, FragmentDefinitionNode } from "graphql/language";
import { JsonLdContextNormalized, JsonLdContext } from "jsonld-context-parser";
import { Algebra } from "sparqlalgebrajs";
import { IConvertOptions } from "./IConvertOptions";
import { IConvertSettings } from "./IConvertSettings";
import { Util } from "./Util";
/**
 * Translate GraphQL queries into SPARQL algebra.
 */
export declare class Converter {
    private readonly util;
    constructor(settings?: IConvertSettings);
    static registerNodeHandlers(util: Util, settings: IConvertSettings): void;
    static registerNodeValueHandlers(util: Util, settings: IConvertSettings): void;
    static registerDirectiveNodeHandlers(util: Util, settings: IConvertSettings): void;
    /**
     * Translates a GraphQL query into SPARQL algebra.
     * @param {string | DocumentNode} graphqlQuery A GraphQL query string or node.
     * @param {IContext} context A JSON-LD context.
     * @param {IConvertOptions} options An options object.
     * @return {Promise<Operation>} A promise resolving to an operation.
     */
    graphqlToSparqlAlgebra(graphqlQuery: string | DocumentNode, context: JsonLdContext, options?: IConvertOptions): Promise<Algebra.Operation>;
    /**
     * Translates a GraphQL query into SPARQL algebra.
     * @param {string | DocumentNode} graphqlQuery A GraphQL query string or node.
     * @param {IContext} context A JSON-LD context.
     * @param {IConvertOptions} options An options object.
     * @return {Operation} An operation.
     */
    graphqlToSparqlAlgebraRawContext(graphqlQuery: string | DocumentNode, context: JsonLdContextNormalized, options?: IConvertOptions): Algebra.Operation;
    /**
     * Create an index of all fragment definitions in the given document.
     *
     * This will assign a new array of definition nodes without fragment definition.
     *
     * @param {DocumentNode} document A document node.
     * @return {{[p: string]: FragmentDefinitionNode}} An index of fragment definition nodes.
     */
    indexFragments(document: DocumentNode): {
        [name: string]: FragmentDefinitionNode;
    };
    private initializeNodeHandlers;
}
