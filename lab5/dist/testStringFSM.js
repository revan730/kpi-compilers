"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringFSM_1 = require("./stringFSM");
var fsm = new stringFSM_1.StringFSM();
console.log(fsm.run('12'));
console.log(fsm.run('ebat'));
console.log(fsm.run('"lol"'));
