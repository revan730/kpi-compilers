"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComplexAssignStatement = (function () {
    function ComplexAssignStatement(id, values) {
        this.id = id;
        this.values = values;
    }
    ComplexAssignStatement.prototype.getId = function () {
        return this.id;
    };
    ComplexAssignStatement.prototype.getValues = function () {
        return this.values;
    };
    return ComplexAssignStatement;
}());
exports.ComplexAssignStatement = ComplexAssignStatement;
