"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("../ast/block");
var func_1 = require("../ast/func");
var functionParameter_1 = require("../ast/functionParameter");
var validateUrlNative = function (url) {
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return !!url.match(expression);
};
exports.ValidateUrlDec = new func_1.Func("validateUrl", [new functionParameter_1.FunctionParameter("string", "url")], new block_1.BlockStatement([]), "boolean", validateUrlNative);
