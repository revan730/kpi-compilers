"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var fs = require("fs");
fs.readFile('testInput1.st', 'utf8', function (err, contents) {
    var l = new lexer_1.Lexer(contents);
    console.log(l.allTokens());
});
