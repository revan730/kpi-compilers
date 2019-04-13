"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func = (function () {
    function Func(id, params, body, ret, native) {
        this.id = id;
        this.params = params;
        this.body = body;
        this.returnType = ret;
        this.native = native; // JS\TS function, will be called instead of body block
        // evaluation if defined.
    }
    Func.prototype.getId = function () {
        return this.id;
    };
    Func.prototype.getParams = function () {
        return this.params;
    };
    Func.prototype.getBody = function () {
        return this.body;
    };
    Func.prototype.getReturnType = function () {
        return this.returnType;
    };
    Func.prototype.getNativeFunc = function () {
        return this.native;
    };
    return Func;
}());
exports.Func = Func;
