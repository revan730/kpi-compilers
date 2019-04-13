"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var varDeclaration_1 = require("./varDeclaration");
var FuncCallExpression = (function () {
    function FuncCallExpression(id, params) {
        var _this = this;
        this.getId = function () {
            return _this.id;
        };
        this.getParams = function () {
            return _this.params;
        };
        this.id = id;
        this.params = params;
    }
    FuncCallExpression.prototype.evaluateType = function (s) {
        // Expression type is function's return type
        // TODO: Check parameter count and types
        var funcDec = s.analyzer.findFunctionDeclaration(this.id, s);
        var funcParams = funcDec.getParams();
        var callParams = this.getParams();
        if (!funcDec) {
            throw new Error("SH19: Trying to call func " + this.id + " but it's not declared");
        }
        // Check if parameter count match
        if (funcParams.length !== callParams.length) {
            throw new Error("SH20: Func " + this.id + " has " + funcParams.length + " params, called with " + callParams.length);
        }
        // Check if parameter types match
        for (var i = 0; i < funcParams.length; i++) {
            var expectedType = funcParams[i].getType();
            var actualType = callParams[i].evaluateType(s);
            if (expectedType !== actualType) {
                throw new Error("SH21: Param at index " + (i + 1) + " expected to have type " + expectedType + ", got " + actualType);
            }
        }
        return s.analyzer.findFunctionDeclaration(this.id, s).getReturnType();
    };
    FuncCallExpression.prototype.evaluateValue = function (s) {
        var funcDec = s.interpreter.getFunc(this.id, s);
        var funcParams = funcDec.getParams();
        var callParams = this.getParams();
        if (funcDec.getNativeFunc()) {
            var nativeFunc = funcDec.getNativeFunc();
            var evaluatedParams = callParams.map(function (p) { return p.evaluateValue(s); });
            var result = nativeFunc.apply(null, evaluatedParams);
            return result;
        }
        // Non-native func
        // Convert call params to var declarations
        var paramDeclarations = callParams.map(function (p, i) {
            return new varDeclaration_1.VarDeclaration(funcParams[i].getType(), funcParams[i].getId(), p.evaluateValue(s));
        });
        return s.interpreter.interpretFunc(funcDec, paramDeclarations, s);
    };
    FuncCallExpression.prototype.getIdentifiers = function () {
        return [this.id];
    };
    return FuncCallExpression;
}());
exports.FuncCallExpression = FuncCallExpression;
