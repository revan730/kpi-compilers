"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComplexField = (function () {
    function ComplexField(type, id) {
        this.type = type;
        this.id = id;
    }
    ComplexField.prototype.getType = function () {
        return this.type;
    };
    ComplexField.prototype.getId = function () {
        return this.id;
    };
    return ComplexField;
}());
exports.ComplexField = ComplexField;
