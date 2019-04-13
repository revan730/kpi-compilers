"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("../ast/block");
var func_1 = require("../ast/func");
var functionParameter_1 = require("../ast/functionParameter");
var printNative = function (msg) { return console.log(msg); };
exports.PrintDec = new func_1.Func("print", [new functionParameter_1.FunctionParameter("string", "msg")], new block_1.BlockStatement([]), null, printNative);
