"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerAdapter = void 0;
/**
 * An abstract handler for GraphQL directives.
 */
class DirectiveNodeHandlerAdapter {
    constructor(targetKind, util, settings) {
        this.targetKind = targetKind;
        this.util = util;
        this.settings = settings;
    }
    /**
     * Get the value of the 'if' argument in a directive.
     * @param {DirectiveNode} directive A directive.
     * @param {IConvertContext} convertContext A convert context.
     * @return {Term} The term.
     */
    getDirectiveConditionalValue(directive, convertContext) {
        const arg = this.util.getArgument(directive.arguments, 'if');
        if (!arg) {
            throw new Error(`The directive ${directive.name.value} is missing an if-argument.`);
        }
        const subValue = this.util.handleNodeValue(arg.value, arg.name.value, convertContext);
        if (subValue.terms.length !== 1) {
            throw new Error(`Can not apply the directive ${directive.name.value} with a list.`);
        }
        return subValue.terms[0];
    }
    /**
     * If a `scope: all` directive param is present.
     * @param {DirectiveNode} directive A directive.
     * @return {boolean} If `scope: all` is present.
     */
    isDirectiveScopeAll(directive) {
        const scopeArg = this.util.getArgument(directive.arguments, 'scope');
        return scopeArg && scopeArg.value.kind === 'EnumValue' && scopeArg.value.value === 'all';
    }
}
exports.DirectiveNodeHandlerAdapter = DirectiveNodeHandlerAdapter;
//# sourceMappingURL=DirectiveNodeHandlerAdapter.js.map