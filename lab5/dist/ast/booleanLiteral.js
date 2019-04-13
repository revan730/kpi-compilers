"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var BooleanLiteral = (function () {
    function BooleanLiteral(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    BooleanLiteral.prototype.evaluateType = function () {
        return token_1.TokenTypes.Boolean;
    };
    BooleanLiteral.prototype.evaluateValue = function (s) {
        return this.getValue();
    };
    BooleanLiteral.prototype.getIdentifiers = function () {
        return [];
    };
    return BooleanLiteral;
}());
exports.BooleanLiteral = BooleanLiteral;
