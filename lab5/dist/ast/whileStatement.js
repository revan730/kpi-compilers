"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WhileStatement = (function () {
    function WhileStatement(condExp, loopStm) {
        this.condExp = condExp;
        this.loopStm = loopStm;
    }
    WhileStatement.prototype.getCondExp = function () {
        return this.condExp;
    };
    WhileStatement.prototype.getLoopStm = function () {
        return this.loopStm;
    };
    return WhileStatement;
}());
exports.WhileStatement = WhileStatement;
