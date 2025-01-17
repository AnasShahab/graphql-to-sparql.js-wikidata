"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingularizeState = void 0;
/**
 * A singularization state for variable values.
 */
var SingularizeState;
(function (SingularizeState) {
    /**
     * If only a first matching value should be picked.
     */
    SingularizeState[SingularizeState["SINGLE"] = 0] = "SINGLE";
    /**
     * If all matching values should be picked.
     */
    SingularizeState[SingularizeState["PLURAL"] = 1] = "PLURAL";
})(SingularizeState = exports.SingularizeState || (exports.SingularizeState = {}));
//# sourceMappingURL=IConvertContext.js.map