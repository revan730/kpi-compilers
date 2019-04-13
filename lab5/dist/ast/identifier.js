"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Identifier = (function () {
    function Identifier(value) {
        var _this = this;
        this.getValue = function () {
            return _this.value;
        };
        this.value = value;
    }
    Identifier.prototype.evaluateValue = function (s) {
        if (s === void 0) { s = Promise.resolve().then(function () { return require("../interpreterScope"); }).InterpreterScope; }
        throw new Error("Method not implemented.");
    };
    Identifier.prototype.evaluateType = function (s) {
        if (s === void 0) { s = Promise.resolve().then(function () { return require("../semantic"); }).Scope; }
        throw new Error("Method not implemented.");
    };
    Identifier.prototype.getIdentifiers = function () {
        throw new Error("Method not implemented.");
    };
    return Identifier;
}());
exports.Identifier = Identifier;
