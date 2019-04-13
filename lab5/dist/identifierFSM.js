"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FSM_1 = require("./FSM");
var CharUtils = require("./charUtils");
function createFSM() {
    var states = new Set([1, 2]);
    var initialState = 1;
    var acceptingStates = new Set([2]);
    var nextState = function (currentState, character) {
        switch (currentState) {
            case 1:
                if (CharUtils.isLetter(character) || character === '_') {
                    return 2;
                }
                break;
            case 2:
                if (CharUtils.isLetter(character) || CharUtils.isDigit(character) || character === '_') {
                    return 2;
                }
                break;
        }
        return FSM_1.FSM.NoNextState;
    };
    var fsm = new FSM_1.FSM(states, initialState, acceptingStates, nextState);
    return fsm;
}
exports.createFSM = createFSM;
