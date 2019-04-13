"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var interpreter_1 = require("./interpreter");
fs.readFile('testInput2.st', 'utf8', function (err, contents) {
    var i = new interpreter_1.Interpreter(contents);
    try {
        i.interpretFile();
    }
    catch (err) {
        console.log(err);
    }
});
