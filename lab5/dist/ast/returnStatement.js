"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReturnStatement = (function () {
    function ReturnStatement(value) {
        this.value = value;
    }
    ReturnStatement.prototype.getValue = function () {
        return this.value;
    };
    ReturnStatement.prototype.evaluateType = function (s) {
        if (!this.value) {
            return null;
        }
        return this.value.evaluateType(s);
    };
    ReturnStatement.prototype.evaluateValue = function (s) {
        return this.value.evaluateValue(s);
    };
    return ReturnStatement;
}());
exports.ReturnStatement = ReturnStatement;
