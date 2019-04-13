"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var TimesExpression = (function () {
    function TimesExpression(lhs, rhs) {
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
    TimesExpression.prototype.evaluateType = function (s) {
        var lhsType = this.lhs.evaluateType(s);
        var rhsType = this.rhs.evaluateType(s);
        if (lhsType !== rhsType) {
            throw new Error("SH??: Non-matching expression types '" + lhsType + "' and '" + rhsType + "'");
        }
        if (lhsType !== token_1.TokenTypes.Integer) {
            throw new Error("SH??: Non-integer type in integer-only operator expression '" + lhsType + "'");
        }
        return token_1.TokenTypes.Integer; // Arithmetic op
    };
    TimesExpression.prototype.evaluateValue = function (s) {
        var lhsValue = this.lhs.evaluateValue(s);
        var rhsValue = this.rhs.evaluateValue(s);
        return lhsValue * rhsValue;
    };
    TimesExpression.prototype.getIdentifiers = function () {
        var lhsIdentifiers = this.lhs.getIdentifiers();
        var rhsIdentifiers = this.rhs.getIdentifiers();
        return lhsIdentifiers.concat(rhsIdentifiers);
    };
    return TimesExpression;
}());
exports.TimesExpression = TimesExpression;
