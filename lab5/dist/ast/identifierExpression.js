"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IdentifierExpression = (function () {
    function IdentifierExpression(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    IdentifierExpression.prototype.evaluateType = function (s) {
        // Expression type is of variable with this id
        return s.analyzer.findVariableDeclaration(this.value, s).getType();
    };
    IdentifierExpression.prototype.evaluateValue = function (s) {
        return s.interpreter.getVar(this.value, s).getValue();
    };
    IdentifierExpression.prototype.getIdentifiers = function () {
        return [this.value];
    };
    return IdentifierExpression;
}());
exports.IdentifierExpression = IdentifierExpression;
