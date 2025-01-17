"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHandlerDefinitionAdapter = void 0;
const NodeHandlerAdapter_1 = require("./NodeHandlerAdapter");
/**
 * A handler for converting GraphQL definition nodes to operations.
 */
class NodeHandlerDefinitionAdapter extends NodeHandlerAdapter_1.NodeHandlerAdapter {
    constructor(targetKind, util, settings) {
        super(targetKind, util, settings);
    }
}
exports.NodeHandlerDefinitionAdapter = NodeHandlerDefinitionAdapter;
//# sourceMappingURL=NodeHandlerDefinitionAdapter.js.map