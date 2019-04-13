"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var fs = require("fs");
var util = require("util");
fs.readFile('testInput1.st', 'utf8', function (err, contents) {
    var p = new parser_1.Parser(contents);
    console.log(util.inspect(p.parseProgram(), { showHidden: false, depth: null }));
});
