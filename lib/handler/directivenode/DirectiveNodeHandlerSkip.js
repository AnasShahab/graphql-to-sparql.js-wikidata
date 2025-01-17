"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerSkip = void 0;
const DirectiveNodeHandlerAdapter_1 = require("./DirectiveNodeHandlerAdapter");
/**
 * A handler for skip directives.
 */
class DirectiveNodeHandlerSkip extends DirectiveNodeHandlerAdapter_1.DirectiveNodeHandlerAdapter {
    constructor(util, settings) {
        super('skip', util, settings);
    }
    handle(directiveContext, convertContext) {
        const val = this.getDirectiveConditionalValue(directiveContext.directive, convertContext);
        if (val.termType === 'Literal' && val.value === 'true') {
            return { ignore: true };
        }
        return {};
    }
}
exports.DirectiveNodeHandlerSkip = DirectiveNodeHandlerSkip;
//# sourceMappingURL=DirectiveNodeHandlerSkip.js.map