"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerPlural = void 0;
const IConvertContext_1 = require("../../IConvertContext");
const DirectiveNodeHandlerAdapter_1 = require("./DirectiveNodeHandlerAdapter");
/**
 * A handler for plural directives.
 */
class DirectiveNodeHandlerPlural extends DirectiveNodeHandlerAdapter_1.DirectiveNodeHandlerAdapter {
    constructor(util, settings) {
        super('plural', util, settings);
    }
    handle(directiveContext, convertContext) {
        if (this.isDirectiveScopeAll(directiveContext.directive)) {
            convertContext.singularizeState = IConvertContext_1.SingularizeState.PLURAL;
        }
        // Delete the existing entry, as this may have already been set before if we were in a single scope.
        delete convertContext.singularizeVariables[this.util.nameToVariable(directiveContext.fieldLabel, convertContext).value];
        return {};
    }
}
exports.DirectiveNodeHandlerPlural = DirectiveNodeHandlerPlural;
//# sourceMappingURL=DirectiveNodeHandlerPlural.js.map