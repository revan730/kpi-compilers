"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Assignment to complex type field using dot operator
// ex. myTypeVar.fieldA = 15;
var AccessAssignStatement = (function () {
    function AccessAssignStatement(complexVar, field, assignment) {
        this.complexVar = complexVar;
        this.field = field;
        this.assignment = assignment;
    }
    AccessAssignStatement.prototype.getComplexId = function () {
        return this.complexVar;
    };
    AccessAssignStatement.prototype.getFieldId = function () {
        return this.field;
    };
    AccessAssignStatement.prototype.getValue = function () {
        return this.assignment;
    };
    return AccessAssignStatement;
}());
exports.AccessAssignStatement = AccessAssignStatement;
