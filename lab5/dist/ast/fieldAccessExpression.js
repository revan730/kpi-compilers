"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldAccessExpression = (function () {
    function FieldAccessExpression(lhs, rhs) {
        var _this = this;
        this.getLHS = function () {
            return _this.lhs;
        };
        this.getRHS = function () {
            return _this.rhs;
        };
        this.lhs = lhs;
        this.rhs = rhs;
    }
    FieldAccessExpression.prototype.evaluateType = function (s) {
        var complexType = this.lhs.getValue();
        var fieldType = this.rhs.getValue();
        return s.analyzer.findComplexFieldDeclaration(complexType, fieldType, s).getType();
    };
    FieldAccessExpression.prototype.evaluateValue = function (s) {
        var complexId = this.lhs.getValue();
        var fieldId = this.rhs.getValue();
        var complexObject = s.interpreter.getVar(complexId, s).getValue();
        return complexObject[fieldId];
    };
    FieldAccessExpression.prototype.getIdentifiers = function () {
        return [this.lhs.getValue(), this.rhs.getValue()];
    };
    return FieldAccessExpression;
}());
exports.FieldAccessExpression = FieldAccessExpression;
