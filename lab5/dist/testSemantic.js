"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semantic_1 = require("./semantic");
var fs = require("fs");
fs.readFile('testInput1.st', 'utf8', function (err, contents) {
    var p = new semantic_1.SemanticAnalyzer(contents);
    try {
        p.analyzeFile();
    }
    catch (err) {
        console.log(err);
    }
});
