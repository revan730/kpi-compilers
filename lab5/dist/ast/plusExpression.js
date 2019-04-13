"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var PlusExpression = (function () {
    function PlusExpression(lhs, rhs) {
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
    PlusExpression.prototype.evaluateType = function (s) {
        var lhsType = this.lhs.evaluateType(s);
        var rhsType = this.rhs.evaluateType(s);
        if (lhsType !== rhsType) {
            throw new Error("SH??: Non-matching expression types '" + lhsType + "' and '" + rhsType + "'");
        }
        if (lhsType !== token_1.TokenTypes.Integer && lhsType !== token_1.TokenTypes.String) {
            throw new Error("SH??: Plus op is only appliable to integer or string types, got '" + lhsType + "'");
        }
        return token_1.TokenTypes.Integer; // Arithmetic op
    };
    PlusExpression.prototype.evaluateValue = function (s) {
        var lhsValue = this.lhs.evaluateValue(s);
        var rhsValue = this.rhs.evaluateValue(s);
        return lhsValue + rhsValue;
    };
    PlusExpression.prototype.getIdentifiers = function () {
        var lhsIdentifiers = this.lhs.getIdentifiers();
        var rhsIdentifiers = this.rhs.getIdentifiers();
        return lhsIdentifiers.concat(rhsIdentifiers);
    };
    return PlusExpression;
}());
exports.PlusExpression = PlusExpression;
