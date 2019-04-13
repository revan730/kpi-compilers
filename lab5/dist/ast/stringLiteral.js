"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var StringLiteral = (function () {
    function StringLiteral(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    StringLiteral.prototype.evaluateType = function () {
        return token_1.TokenTypes.String;
    };
    StringLiteral.prototype.evaluateValue = function (s) {
        return this.getValue();
    };
    StringLiteral.prototype.getIdentifiers = function () {
        return [];
    };
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
