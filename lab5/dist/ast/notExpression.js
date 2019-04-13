"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var NotExpression = (function () {
    function NotExpression(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    NotExpression.prototype.evaluateType = function (s) {
        var type = this.value.evaluateType(s);
        if (type !== token_1.TokenTypes.Boolean) {
            throw new Error("SH??: Non-boolean type in boolean-only operator expression '" + type + "'");
        }
        return token_1.TokenTypes.Boolean; // Logic op
    };
    NotExpression.prototype.evaluateValue = function (s) {
        var value = this.value.evaluateValue(s);
        return !value;
    };
    NotExpression.prototype.getIdentifiers = function () {
        return this.getIdentifiers();
    };
    return NotExpression;
}());
exports.NotExpression = NotExpression;
