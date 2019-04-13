"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CharUtils = require("./charUtils");
var numberFSM_1 = require("./numberFSM");
var token_1 = require("./token");
var Lexer = (function () {
    function Lexer(input) {
        this.input = this.stripFinalNewline(input);
        this.column = 1;
        this.line = 1;
        this.position = 0;
    }
    Lexer.prototype.stripFinalNewline = function (input) {
        var LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt(0);
        var CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt(0);
        if (input[input.length - 1] === LF) {
            input = input.slice(0, input.length - 1);
        }
        if (input[input.length - 1] === CR) {
            input = input.slice(0, input.length - 1);
        }
        return input;
    };
    Lexer.prototype.allTokens = function () {
        var token = this.nextToken();
        var tokens = [];
        while (token.getType() !== token_1.TokenTypes.EOF) {
            tokens.push(token);
            token = this.nextToken();
        }
        tokens.push(token);
        return tokens;
    };
    Lexer.prototype.nextToken = function () {
        if (this.position >= this.input.length) {
            return new token_1.Token(token_1.TokenTypes.EOF, '', this.line, this.column);
        }
        this.skipWhitespacesAndNewLines();
        var character = this.input.charAt(this.position);
        if (CharUtils.isLetter(character)) {
            return this.recognizeIdentifier();
        }
        if (CharUtils.isDigit(character)) {
            return this.recognizeNumber();
        }
        if (character === '"') {
            return this.recognizeString();
        }
        if (character === "'") {
            return this.recognizeRune();
        }
        if (CharUtils.isOperator(character)) {
            return this.recognizeOperator();
        }
        if (CharUtils.isParenthesis(character)) {
            return this.recognizeParenthesis();
        }
        if (CharUtils.isPunctuation(character)) {
            return this.recognizePunctuation();
        }
        if (CharUtils.isBracket(character)) {
            return this.recognizeBracket();
        }
        throw new Error("Unrecognized character " + character.charCodeAt(0) + " at line " + this.line + " and column " + this.column + ".");
    };
    Lexer.prototype.skipWhitespacesAndNewLines = function () {
        while (this.position < this.input.length && CharUtils.isWhitespaceOrNewLine(this.input.charAt(this.position))) {
            if (CharUtils.isNewLine(this.input.charAt(this.position))) {
                this.line += 1;
                this.column = 1;
            }
            else {
                this.column += 1;
            }
            this.position += 1;
        }
    };
    Lexer.prototype.recognizeParenthesis = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === '(') {
            return new token_1.Token(token_1.TokenTypes.Lparent, '(', line, column);
        }
        return new token_1.Token(token_1.TokenTypes.Rparent, ')', line, column);
    };
    Lexer.prototype.recognizePunctuation = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === ';') {
            return new token_1.Token(token_1.TokenTypes.Semi, ';', line, column);
        }
        return new token_1.Token(token_1.TokenTypes.Comma, ',', line, column);
    };
    Lexer.prototype.recognizeBracket = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === '{') {
            return new token_1.Token(token_1.TokenTypes.Lbrace, '{', line, column);
        }
        return new token_1.Token(token_1.TokenTypes.Rbrace, '}', line, column);
    };
    Lexer.prototype.recognizeOperator = function () {
        var character = this.input.charAt(this.position);
        if (CharUtils.isComparisonOperator(character)) {
            return this.recognizeComparisonOperator();
        }
        if (CharUtils.isArithmeticOperator(character)) {
            return this.recognizeArithmeticOperator();
        }
        if (CharUtils.isLogicalOperator(character)) {
            return this.recognizeLogicalOperator();
        }
    };
    Lexer.prototype.recognizeLogicalOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        var isLookaheadAmpSymbol = lookahead !== null && lookahead === '&';
        var isLookaheadPipeSymbol = lookahead !== null && lookahead === '|';
        this.position += 1;
        this.column += 1;
        if (isLookaheadAmpSymbol || isLookaheadPipeSymbol) {
            this.position += 1;
            this.column += 1;
        }
        switch (character) {
            case '&':
                return isLookaheadAmpSymbol
                    ? new token_1.Token(token_1.TokenTypes.And, '&&', line, column)
                    : new token_1.Token(token_1.TokenTypes.Amp, '&', line, column);
            case '|':
                return isLookaheadPipeSymbol
                    ? new token_1.Token(token_1.TokenTypes.Or, '||', line, column)
                    : new token_1.Token(token_1.TokenTypes.Unknown, character + lookahead, line, column);
            default:
                break;
        }
    };
    Lexer.prototype.recognizeComparisonOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        // Whether the 'lookahead' character is the equal symbol '='.
        var isLookaheadEqualSymbol = lookahead !== null && lookahead === '=';
        this.position += 1;
        this.column += 1;
        if (isLookaheadEqualSymbol) {
            this.position += 1;
            this.column += 1;
        }
        switch (character) {
            case '>':
                return isLookaheadEqualSymbol
                    ? new token_1.Token(token_1.TokenTypes.RtEq, '>=', line, column)
                    : new token_1.Token(token_1.TokenTypes.Rt, '>', line, column);
            case '<':
                return isLookaheadEqualSymbol
                    ? new token_1.Token(token_1.TokenTypes.LtEq, '<=', line, column)
                    : new token_1.Token(token_1.TokenTypes.Lt, '<', line, column);
            case '=':
                return isLookaheadEqualSymbol
                    ? new token_1.Token(token_1.TokenTypes.Eq, '==', line, column)
                    : new token_1.Token(token_1.TokenTypes.Assign, '=', line, column);
            case '!':
                return isLookaheadEqualSymbol
                    ? new token_1.Token(token_1.TokenTypes.Neq, '!=', line, column)
                    : new token_1.Token(token_1.TokenTypes.Not, '!', line, column);
            default:
                break;
        }
    };
    Lexer.prototype.recognizeArithmeticOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        // Whether the 'lookahead' character is the equal symbol '='.
        var isLookaheadPlusSymbol = lookahead !== null && lookahead === '+';
        var isLookaheadMinusSymbol = lookahead !== null && lookahead === '-';
        this.position += 1;
        this.column += 1;
        if (isLookaheadPlusSymbol || isLookaheadMinusSymbol) {
            this.position += 1;
            this.column += 1;
        }
        switch (character) {
            case '+':
                return isLookaheadPlusSymbol
                    ? new token_1.Token(token_1.TokenTypes.PostIncrement, '++', line, column)
                    : new token_1.Token(token_1.TokenTypes.Plus, '+', line, column);
            case '-':
                return isLookaheadMinusSymbol
                    ? new token_1.Token(token_1.TokenTypes.PostDecrement, '--', line, column)
                    : new token_1.Token(token_1.TokenTypes.Minus, '-', line, column);
            case '*':
                return new token_1.Token(token_1.TokenTypes.Times, '*', line, column);
            case '/':
                return new token_1.Token(token_1.TokenTypes.Div, '/', line, column);
            case '.':// Not really an arithmetic op, but fit here so well
                return new token_1.Token(token_1.TokenTypes.Dot, '.', line, column);
            default:
                break;
        }
    };
    Lexer.prototype.recognizeIdentifier = function () {
        var identifier = '';
        var line = this.line;
        var column = this.column;
        var position = this.position;
        while (position < this.input.length) {
            var character = this.input.charAt(position);
            if (!(CharUtils.isLetter(character) || CharUtils.isDigit(character) || character === '_')) {
                break;
            }
            identifier += character;
            position += 1;
        }
        this.position += identifier.length;
        this.column += identifier.length;
        if (CharUtils.isIdentifierReserved(identifier)) {
            return new token_1.Token(identifier, identifier, line, column);
        }
        if (CharUtils.isBooleanLiteral(identifier)) {
            return new token_1.Token(token_1.TokenTypes.BooleanLiteral, identifier, line, column);
        }
        return new token_1.Token(token_1.TokenTypes.Identifier, identifier, line, column);
    };
    Lexer.prototype.recognizeNumber = function () {
        var line = this.line;
        var column = this.column;
        // We delegate the building of the FSM to a helper method.
        var fsm = new numberFSM_1.NumberFSM();
        // The input to the FSM will be all the characters from
        // the current position to the rest of the lexer's input.
        var fsmInput = this.input.substring(this.position);
        // Here, in addition of the FSM returning whether a number
        // has been recognized or not, it also returns the number
        // recognized in the 'number' variable. If no number has
        // been recognized, 'number' will be 'null'.
        var _a = fsm.run(fsmInput), recognized = _a.recognized, value = _a.value;
        if (recognized) {
            this.position += value.length;
            this.column += value.length;
            return new token_1.Token(token_1.TokenTypes.IntegerLiteral, value, line, column);
        }
        // ...
    };
    Lexer.prototype.recognizeString = function () {
        var line = this.line;
        var column = this.column;
        var results = /"(\\.|[^"\\])*\"/.exec(this.input.substring(this.position));
        if (!results) {
            return new token_1.Token(token_1.TokenTypes.Unknown, '', line, column);
        }
        this.position += results[0].length;
        this.column += results[0].length;
        return new token_1.Token(token_1.TokenTypes.StringLiteral, results[0].replace(/["]+/g, ''), line, column);
    };
    Lexer.prototype.recognizeRune = function () {
        var line = this.line;
        var column = this.column;
        var results = /^'\w'/.exec(this.input.substring(this.position));
        if (!results) {
            return new token_1.Token(token_1.TokenTypes.Unknown, '', line, column);
        }
        this.position += results[0].length;
        this.column += results[0].length;
        return new token_1.Token(token_1.TokenTypes.RuneLiteral, results[0], line, column);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
