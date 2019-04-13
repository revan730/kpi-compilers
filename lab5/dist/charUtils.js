"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var operators = [
    token_1.TokenTypes.Pipe,
    token_1.TokenTypes.Amp,
    token_1.TokenTypes.Not,
    token_1.TokenTypes.And,
    token_1.TokenTypes.Or,
    token_1.TokenTypes.Eq,
    token_1.TokenTypes.Neq,
    token_1.TokenTypes.Lt,
    token_1.TokenTypes.Rt,
    token_1.TokenTypes.LtEq,
    token_1.TokenTypes.RtEq,
    token_1.TokenTypes.Plus,
    token_1.TokenTypes.Minus,
    token_1.TokenTypes.Times,
    token_1.TokenTypes.Div,
    token_1.TokenTypes.Assign,
    token_1.TokenTypes.Dot,
    token_1.TokenTypes.PostIncrement,
    token_1.TokenTypes.PostDecrement,
];
var reserved = [
    token_1.TokenTypes.Integer,
    token_1.TokenTypes.Rune,
    token_1.TokenTypes.String,
    token_1.TokenTypes.Boolean,
    token_1.TokenTypes.User,
    token_1.TokenTypes.Repo,
    token_1.TokenTypes.CiConfig,
    token_1.TokenTypes.Deployment,
    token_1.TokenTypes.Manifest,
    token_1.TokenTypes.If,
    token_1.TokenTypes.Else,
    token_1.TokenTypes.While,
    token_1.TokenTypes.Void,
    token_1.TokenTypes.Var,
    token_1.TokenTypes.Complex,
    token_1.TokenTypes.Return,
    token_1.TokenTypes.Command,
    token_1.TokenTypes.Func,
];
var postfixOperators = [
    '+',
    '-',
];
var compOperators = [
    '=',
    '!',
    '<',
    '>',
];
var logicalOperators = [
    '&',
    '|',
];
var punctuationChars = [
    ';',
    ','
];
var arithmeticOperators = [
    token_1.TokenTypes.Plus,
    token_1.TokenTypes.Minus,
    token_1.TokenTypes.Times,
    token_1.TokenTypes.Div,
    token_1.TokenTypes.Dot,
];
function isLetter(character) {
    return /^[a-zA-Z]$/gm.test(character);
}
exports.isLetter = isLetter;
function isDigit(character) {
    return /^[0-9]$/gm.test(character);
}
exports.isDigit = isDigit;
function isOperator(character) {
    return operators.indexOf(character) !== -1;
}
exports.isOperator = isOperator;
function isComparisonOperator(character) {
    return compOperators.indexOf(character) !== -1;
}
exports.isComparisonOperator = isComparisonOperator;
function isArithmeticOperator(character) {
    return arithmeticOperators.indexOf(character) !== -1;
}
exports.isArithmeticOperator = isArithmeticOperator;
function isPostfixOperator(character) {
    return postfixOperators.indexOf(character) !== -1;
}
exports.isPostfixOperator = isPostfixOperator;
function isLogicalOperator(character) {
    return logicalOperators.indexOf(character) !== -1;
}
exports.isLogicalOperator = isLogicalOperator;
function isParenthesis(character) {
    return character === '(' || character === ')';
}
exports.isParenthesis = isParenthesis;
function isNewLine(character) {
    return /\n/.test(character);
}
exports.isNewLine = isNewLine;
function isWhitespaceOrNewLine(character) {
    return character === ' ' || character === '\t' || isNewLine(character);
}
exports.isWhitespaceOrNewLine = isWhitespaceOrNewLine;
function isPunctuation(character) {
    return punctuationChars.indexOf(character) !== -1;
}
exports.isPunctuation = isPunctuation;
function isIdentifierReserved(character) {
    return reserved.indexOf(character) !== -1;
}
exports.isIdentifierReserved = isIdentifierReserved;
function isBracket(character) {
    return character === '{' || character === '}';
}
exports.isBracket = isBracket;
function isBooleanLiteral(identifier) {
    return identifier === 'true' || identifier === 'false';
}
exports.isBooleanLiteral = isBooleanLiteral;
function returnBooleanValue(stringBoolean) {
    if (stringBoolean === 'true') {
        return true;
    }
    else {
        return false;
    }
}
exports.returnBooleanValue = returnBooleanValue;
