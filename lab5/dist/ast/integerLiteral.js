"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var IntegerLiteral = (function () {
    function IntegerLiteral(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    IntegerLiteral.prototype.evaluateType = function () {
        return token_1.TokenTypes.Integer;
    };
    IntegerLiteral.prototype.evaluateValue = function (s) {
        return this.value;
    };
    IntegerLiteral.prototype.getIdentifiers = function () {
        return [];
    };
    return IntegerLiteral;
}());
exports.IntegerLiteral = IntegerLiteral;
