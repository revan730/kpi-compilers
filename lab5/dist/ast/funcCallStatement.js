"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FuncCallStatement = (function () {
    function FuncCallStatement(funcId, params) {
        this.funcId = funcId;
        this.params = params;
    }
    FuncCallStatement.prototype.getFuncId = function () {
        return this.funcId;
    };
    FuncCallStatement.prototype.getParams = function () {
        return this.params;
    };
    return FuncCallStatement;
}());
exports.FuncCallStatement = FuncCallStatement;
