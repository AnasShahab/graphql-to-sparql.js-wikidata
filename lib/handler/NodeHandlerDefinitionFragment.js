"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerDefinitionFragment = void 0;
const NodeHandlerDefinitionAdapter_1 = require("./NodeHandlerDefinitionAdapter");
/**
 * Errors if fragment definitions are found,
 * as these should have been processed away earlier.
 */
class NodeHandlerDefinitionFragment extends NodeHandlerDefinitionAdapter_1.NodeHandlerDefinitionAdapter {
    constructor(util, settings) {
        super('FragmentDefinition', util, settings);
    }
    handle(operationDefinition, convertContext) {
        throw new Error('Illegal state: fragment definitions must be indexed and removed before processing');
    }
}
exports.NodeHandlerDefinitionFragment = NodeHandlerDefinitionFragment;
//# sourceMappingURL=NodeHandlerDefinitionFragment.js.map