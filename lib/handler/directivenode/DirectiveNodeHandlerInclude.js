"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerInclude = void 0;
const DirectiveNodeHandlerAdapter_1 = require("./DirectiveNodeHandlerAdapter");
/**
 * A handler for include directives.
 */
class DirectiveNodeHandlerInclude extends DirectiveNodeHandlerAdapter_1.DirectiveNodeHandlerAdapter {
    constructor(util, settings) {
        super('include', util, settings);
    }
    handle(directiveContext, convertContext) {
        const val = this.getDirectiveConditionalValue(directiveContext.directive, convertContext);
        if (val.termType === 'Literal' && val.value === 'false') {
            return { ignore: true };
        }
        return {};
    }
}
exports.DirectiveNodeHandlerInclude = DirectiveNodeHandlerInclude;
//# sourceMappingURL=DirectiveNodeHandlerInclude.js.map