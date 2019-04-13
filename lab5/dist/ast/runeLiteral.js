"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("../token");
var RuneLiteral = (function () {
    function RuneLiteral(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    RuneLiteral.prototype.evaluateType = function () {
        return token_1.TokenTypes.Rune;
    };
    RuneLiteral.prototype.evaluateValue = function (s) {
        return this.getValue();
    };
    RuneLiteral.prototype.getIdentifiers = function () {
        return [];
    };
    return RuneLiteral;
}());
exports.RuneLiteral = RuneLiteral;
