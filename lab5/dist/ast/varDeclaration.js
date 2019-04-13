"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VarDeclaration = (function () {
    function VarDeclaration(type, identifier, value) {
        this.type = type;
        this.identifier = identifier;
        this.value = value;
    }
    VarDeclaration.prototype.getType = function () {
        return this.type;
    };
    VarDeclaration.prototype.getId = function () {
        return this.identifier;
    };
    VarDeclaration.prototype.getValue = function () {
        return this.value;
    };
    VarDeclaration.prototype.setValue = function (v) {
        this.value = v;
    };
    return VarDeclaration;
}());
exports.VarDeclaration = VarDeclaration;
