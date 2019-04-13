"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identifierFSM_1 = require("./identifierFSM");
var fsm = identifierFSM_1.createFSM();
console.log(fsm.run('0wrong'));
console.log(fsm.run('right'));
console.log(fsm.run('Still_Right1'));
