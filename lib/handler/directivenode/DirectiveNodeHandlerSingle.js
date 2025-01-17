"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerSingle = void 0;
const IConvertContext_1 = require("../../IConvertContext");
const DirectiveNodeHandlerAdapter_1 = require("./DirectiveNodeHandlerAdapter");
/**
 * A handler for single directives.
 */
class DirectiveNodeHandlerSingle extends DirectiveNodeHandlerAdapter_1.DirectiveNodeHandlerAdapter {
    constructor(util, settings) {
        super('single', util, settings);
    }
    handle(directiveContext, convertContext) {
        if (this.isDirectiveScopeAll(directiveContext.directive)) {
            convertContext.singularizeState = IConvertContext_1.SingularizeState.SINGLE;
        }
        convertContext.singularizeVariables[this.util.nameToVariable(directiveContext.fieldLabel, convertContext).value] = true;
        return {};
    }
}
exports.DirectiveNodeHandlerSingle = DirectiveNodeHandlerSingle;
//# sourceMappingURL=DirectiveNodeHandlerSingle.js.map