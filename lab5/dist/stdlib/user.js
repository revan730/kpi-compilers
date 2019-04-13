"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var complexType_1 = require("../ast/complexType");
var complexField_1 = require("../ast/complexField");
exports.UserDec = new complexType_1.ComplexType("user", [
    new complexField_1.ComplexField("string", "hookSecret"),
    new complexField_1.ComplexField("string", "accessToken"),
]);
