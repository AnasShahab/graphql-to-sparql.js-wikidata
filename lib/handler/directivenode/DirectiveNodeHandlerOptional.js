"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveNodeHandlerOptional = void 0;
const DirectiveNodeHandlerAdapter_1 = require("./DirectiveNodeHandlerAdapter");
/**
 * A handler for optional directives.
 */
class DirectiveNodeHandlerOptional extends DirectiveNodeHandlerAdapter_1.DirectiveNodeHandlerAdapter {
    constructor(util, settings) {
        super('optional', util, settings);
    }
    handle(directiveContext, convertContext) {
        return {
            operationOverrider: (operation) => this.util.operationFactory.createLeftJoin(this.util.operationFactory.createBgp([]), operation),
        };
    }
}
exports.DirectiveNodeHandlerOptional = DirectiveNodeHandlerOptional;
//# sourceMappingURL=DirectiveNodeHandlerOptional.js.map