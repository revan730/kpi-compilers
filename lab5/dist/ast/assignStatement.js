"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssignStatement = (function () {
    function AssignStatement(id, value) {
        this.id = id;
        this.value = value;
    }
    AssignStatement.prototype.getId = function () {
        return this.id;
    };
    AssignStatement.prototype.getValue = function () {
        return this.value;
    };
    return AssignStatement;
}());
exports.AssignStatement = AssignStatement;
