"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var NegativeExpression = (function () {
    function NegativeExpression(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    NegativeExpression.prototype.evaluateType = function (s) {
        var type = this.value.evaluateType(s);
        if (type !== token_1.TokenTypes.Integer) {
            throw new Error("SH??: Non-integer type in integer-only operator expression '" + type + "'");
        }
        return token_1.TokenTypes.Integer;
    };
    NegativeExpression.prototype.evaluateValue = function (s) {
        var value = this.value.evaluateValue(s);
        return -value;
    };
    NegativeExpression.prototype.getIdentifiers = function () {
        return this.value.getIdentifiers();
    };
    return NegativeExpression;
}());
exports.NegativeExpression = NegativeExpression;
