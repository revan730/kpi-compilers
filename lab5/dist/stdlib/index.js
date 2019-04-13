"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var itoa_1 = require("./itoa");
var print_1 = require("./print");
var validateRepo_1 = require("./validateRepo");
var validateUrl_1 = require("./validateUrl");
var user_1 = require("./user");
function exportFuncDeclarations() {
    return [print_1.PrintDec, itoa_1.ItoaDec, validateRepo_1.ValidateRepoDec, validateUrl_1.ValidateUrlDec];
}
exports.exportFuncDeclarations = exportFuncDeclarations;
function exportComplexTypeDeclarations() {
    return [user_1.UserDec];
}
exports.exportComplexTypeDeclarations = exportComplexTypeDeclarations;
