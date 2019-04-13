"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FSM = (function () {
    function FSM(states, initialState, acceptingStates, nextState) {
        this.states = states;
        this.initialState = initialState;
        this.acceptingStates = acceptingStates;
        this.nextState = nextState;
    }
    FSM.prototype.run = function (input) {
        var _this = this;
        var currentState = this.initialState;
        var length = 0;
        input.split('').every(function (character, i) {
            var nextState = _this.nextState(currentState, character);
            if (nextState === FSM.NoNextState) {
                return false;
            }
            currentState = nextState;
            length = i;
            return true;
        });
        return {
            recognized: this.acceptingStates.has(currentState),
            value: input.slice(0, length + 1),
            state: currentState
        };
    };
    return FSM;
}());
exports.FSM = FSM;
(function (FSM) {
    FSM.NoNextState = -1;
})(FSM = exports.FSM || (exports.FSM = {}));
exports.FSM = FSM;
