"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValueHandlerVariable = void 0;
const NodeValueHandlerAdapter_1 = require("./NodeValueHandlerAdapter");
/**
 * Converts GraphQL variables to terms based on the contents of the variablesDict.
 */
class NodeValueHandlerVariable extends NodeValueHandlerAdapter_1.NodeValueHandlerAdapter {
    constructor(util, settings) {
        super('Variable', util, settings);
    }
    handle(valueNode, fieldName, convertContext) {
        const id = valueNode.name.value;
        const value = convertContext.variablesDict[id];
        const meta = convertContext.variablesMetaDict[id];
        // Handle missing values
        if (!value) {
            if (!convertContext.ignoreUnknownVariables && (!meta || meta.mandatory)) {
                throw new Error(`Undefined variable: ${id}`);
            }
            else {
                const variable = this.util.dataFactory.variable(id);
                if (convertContext.terminalVariables.map((v) => v.value).indexOf(id) < 0) {
                    convertContext.terminalVariables.push(variable);
                }
                return { terms: [variable] };
            }
        }
        // Don't allow variables that refer to other variables
        if (value.kind === 'Variable') {
            throw new Error(`Variable refers to another variable: ${id}`);
        }
        if (meta) {
            // Check the type
            if (meta.list) {
                // If we expect a list, check if we got a list.
                if (value.kind !== 'ListValue') {
                    throw new Error(`Expected a list, but got ${value.kind} for ${id}`);
                }
                // Check the type in the list
                if (meta.type) {
                    const listValue = value;
                    for (const v of listValue.values) {
                        if (v.kind !== meta.type) {
                            throw new Error(`Expected ${meta.type}, but got ${v.kind} for ${id}`);
                        }
                    }
                }
            }
            else if (meta.type) {
                // This is allowed to be different (?)
                /*if (value.kind !== meta.type) {
                  throw new Error(`Expected ${meta.type}, but got ${value.kind} for ${id}`);
                }*/
            }
        }
        return this.util.handleNodeValue(value, fieldName, convertContext);
    }
}
exports.NodeValueHandlerVariable = NodeValueHandlerVariable;
//# sourceMappingURL=NodeValueHandlerVariable.js.map