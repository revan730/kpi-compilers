"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockStatement = (function () {
    function BlockStatement(statementList) {
        this.statementList = statementList;
    }
    BlockStatement.prototype.getStatementsList = function () {
        return this.statementList;
    };
    return BlockStatement;
}());
exports.BlockStatement = BlockStatement;
