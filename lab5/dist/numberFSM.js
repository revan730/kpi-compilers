"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FSM_1 = require("./FSM");
var charUtils_1 = require("./charUtils");
var States = {
    Initial: 1,
    Integer: 2,
    BeginNumberWithFractionalPart: 3,
    NumberWithFractionalPart: 4,
    BeginNumberWithExponent: 5,
    BeginNumberWithSignedExponent: 6,
    NumberWithExponent: 7,
    NoNextState: -1
};
var equalToState = function (current) { return function (stateName) { return current === States[stateName]; }; };
function nextState(currentState, character) {
    var stateIs = equalToState(currentState);
    if (stateIs('Initial') && charUtils_1.isDigit(character)) {
        return States.Integer;
    }
    if (character === '.') {
        return States.BeginNumberWithFractionalPart;
    }
    if (stateIs('NumberWithExponent') && charUtils_1.isDigit(character))
        return States.NumberWithExponent;
    if (stateIs('Integer')) {
        if (charUtils_1.isDigit(character)) {
            return States.Integer;
        }
        if (character.toLowerCase() === 'e') {
            return States.BeginNumberWithExponent;
        }
    }
    if (stateIs('BeginNumberWithFractionalPart'))
        if (charUtils_1.isDigit(character)) {
            return States.NumberWithFractionalPart;
        }
    if (stateIs('NumberWithFractionalPart')) {
        if (charUtils_1.isDigit(character)) {
            return States.NumberWithFractionalPart;
        }
        if (character.toLowerCase() === 'e') {
            return States.BeginNumberWithExponent;
        }
    }
    if (stateIs('BeginNumberWithExponent')) {
        if (character === '+' || character === '-') {
            return States.BeginNumberWithSignedExponent;
        }
        if (charUtils_1.isDigit(character)) {
            return States.NumberWithExponent;
        }
    }
    ;
    if (stateIs('BeginNumberWithSignedExponent'))
        if (charUtils_1.isDigit(character)) {
            return States.NumberWithExponent;
        }
    return States.NoNextState;
}
;
var NumberFSM = (function (_super) {
    __extends(NumberFSM, _super);
    function NumberFSM() {
        var _this = this;
        var acceptingStates = new Set([States.Integer, States.NumberWithFractionalPart, States.NumberWithExponent]);
        _this = _super.call(this, Object.values(States), States.Initial, acceptingStates, nextState) || this;
        _this.states = States;
        return _this;
    }
    return NumberFSM;
}(FSM_1.FSM));
exports.NumberFSM = NumberFSM;
