"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComplexType = (function () {
    function ComplexType(id, fields) {
        this.id = id;
        this.fields = fields;
    }
    ComplexType.prototype.getId = function () {
        return this.id;
    };
    ComplexType.prototype.getFields = function () {
        return this.fields;
    };
    return ComplexType;
}());
exports.ComplexType = ComplexType;
