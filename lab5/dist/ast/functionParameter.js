"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionParameter = (function () {
    function FunctionParameter(type, id) {
        this.type = type;
        this.id = id;
    }
    FunctionParameter.prototype.getType = function () {
        return this.type;
    };
    FunctionParameter.prototype.getId = function () {
        return this.id;
    };
    return FunctionParameter;
}());
exports.FunctionParameter = FunctionParameter;
