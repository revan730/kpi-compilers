"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IfStatement = (function () {
    function IfStatement(condExp, trueStm, falseStm) {
        this.condExp = condExp;
        this.trueStm = trueStm;
        this.falseStm = falseStm;
    }
    IfStatement.prototype.getCondExp = function () {
        return this.condExp;
    };
    IfStatement.prototype.getTrueStm = function () {
        return this.trueStm;
    };
    IfStatement.prototype.getTrueStmArr = function () {
        var block = this.trueStm;
        return block.getStatementsList();
    };
    IfStatement.prototype.getFalseStm = function () {
        return this.falseStm;
    };
    IfStatement.prototype.getFalseStmArr = function () {
        var block = this.falseStm;
        return block.getStatementsList();
    };
    IfStatement.prototype.hasFalseBlock = function () {
        return !!this.falseStm;
    };
    return IfStatement;
}());
exports.IfStatement = IfStatement;
