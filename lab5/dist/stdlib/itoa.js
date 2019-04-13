"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("../ast/block");
var func_1 = require("../ast/func");
var functionParameter_1 = require("../ast/functionParameter");
var itoaNative = function (i) { return String(i); };
exports.ItoaDec = new func_1.Func("itoa", [new functionParameter_1.FunctionParameter("integer", "i")], new block_1.BlockStatement([]), "string", itoaNative);
