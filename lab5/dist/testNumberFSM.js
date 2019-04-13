"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numberFSM_1 = require("./numberFSM");
var fsm = new numberFSM_1.NumberFSM();
console.log(fsm.run('12'));
console.log(fsm.run('ebat'));
