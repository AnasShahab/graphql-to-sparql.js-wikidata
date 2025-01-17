"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const language_1 = require("graphql/language");
const handler_1 = require("./handler");
const directivenode_1 = require("./handler/directivenode");
const IConvertContext_1 = require("./IConvertContext");
const Util_1 = require("./Util");
/**
 * Translate GraphQL queries into SPARQL algebra.
 */
class Converter {
    constructor(settings) {
        settings = settings || {};
        settings.variableDelimiter = settings.variableDelimiter || '_';
        settings.expressionVariableCounter = settings.expressionVariableCounter || 0;
        this.util = new Util_1.Util(settings);
        this.initializeNodeHandlers(settings);
    }
    static registerNodeHandlers(util, settings) {
        util.registerNodeHandler(new handler_1.NodeHandlerDocument(util, settings));
        util.registerNodeHandler(new handler_1.NodeHandlerDefinitionOperation(util, settings));
        util.registerNodeHandler(new handler_1.NodeHandlerDefinitionFragment(util, settings));
        util.registerNodeHandler(new handler_1.NodeHandlerSelectionFragmentSpread(util, settings));
        util.registerNodeHandler(new handler_1.NodeHandlerSelectionInlineFragment(util, settings));
        util.registerNodeHandler(new handler_1.NodeHandlerSelectionField(util, settings));
    }
    static registerNodeValueHandlers(util, settings) {
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerVariable(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerInt(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerFloat(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerString(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerBoolean(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerNull(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerEnum(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerList(util, settings));
        util.registerNodeValueHandler(new handler_1.NodeValueHandlerObject(util, settings));
    }
    static registerDirectiveNodeHandlers(util, settings) {
        util.registerDirectiveNodeHandler(new directivenode_1.DirectiveNodeHandlerInclude(util, settings));
        util.registerDirectiveNodeHandler(new directivenode_1.DirectiveNodeHandlerOptional(util, settings));
        util.registerDirectiveNodeHandler(new directivenode_1.DirectiveNodeHandlerPlural(util, settings));
        util.registerDirectiveNodeHandler(new directivenode_1.DirectiveNodeHandlerSingle(util, settings));
        util.registerDirectiveNodeHandler(new directivenode_1.DirectiveNodeHandlerSkip(util, settings));
    }
    /**
     * Translates a GraphQL query into SPARQL algebra.
     * @param {string | DocumentNode} graphqlQuery A GraphQL query string or node.
     * @param {IContext} context A JSON-LD context.
     * @param {IConvertOptions} options An options object.
     * @return {Promise<Operation>} A promise resolving to an operation.
     */
    graphqlToSparqlAlgebra(graphqlQuery, context, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphqlToSparqlAlgebraRawContext(graphqlQuery, yield this.util.contextParser.parse(context), options);
        });
    }
    /**
     * Translates a GraphQL query into SPARQL algebra.
     * @param {string | DocumentNode} graphqlQuery A GraphQL query string or node.
     * @param {IContext} context A JSON-LD context.
     * @param {IConvertOptions} options An options object.
     * @return {Operation} An operation.
     */
    graphqlToSparqlAlgebraRawContext(graphqlQuery, context, options) {
        options = options || {};
        const document = typeof graphqlQuery === 'string' ? language_1.parse(graphqlQuery) : graphqlQuery;
        const fragmentDefinitions = this.indexFragments(document);
        const convertContext = {
            context,
            fragmentDefinitions,
            graph: this.util.dataFactory.defaultGraph(),
            path: [],
            singularizeState: IConvertContext_1.SingularizeState.PLURAL,
            singularizeVariables: options.singularizeVariables || {},
            subject: null,
            terminalVariables: [],
            variablesDict: options.variablesDict || {},
            variablesMetaDict: {},
        };
        return this.util.handleNode(document, convertContext);
    }
    /**
     * Create an index of all fragment definitions in the given document.
     *
     * This will assign a new array of definition nodes without fragment definition.
     *
     * @param {DocumentNode} document A document node.
     * @return {{[p: string]: FragmentDefinitionNode}} An index of fragment definition nodes.
     */
    indexFragments(document) {
        const fragmentDefinitions = {};
        const newDefinitions = [];
        for (const definition of document.definitions) {
            if (definition.kind === 'FragmentDefinition') {
                fragmentDefinitions[definition.name.value] = definition;
            }
            else {
                newDefinitions.push(definition);
            }
        }
        document.definitions = newDefinitions;
        return fragmentDefinitions;
    }
    initializeNodeHandlers(settings) {
        Converter.registerNodeHandlers(this.util, settings);
        Converter.registerNodeValueHandlers(this.util, settings);
        Converter.registerDirectiveNodeHandlers(this.util, settings);
    }
}
exports.Converter = Converter;
//# sourceMappingURL=Converter.js.map