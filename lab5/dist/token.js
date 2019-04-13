"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenTypes;
(function (TokenTypes) {
    TokenTypes.RuneLiteral = 'runeLiteral';
    TokenTypes.StringLiteral = 'stringLiteral';
    TokenTypes.IntegerLiteral = 'integerLiteral';
    TokenTypes.BooleanLiteral = 'booleanLiteral';
    TokenTypes.Identifier = 'identifier';
    TokenTypes.EOF = 'eof';
    TokenTypes.Unknown = 'unknown';
    TokenTypes.Pipe = '|';
    TokenTypes.Amp = '&';
    TokenTypes.Not = '!';
    TokenTypes.And = '&&';
    TokenTypes.Or = '||';
    TokenTypes.Eq = '==';
    TokenTypes.Neq = '!=';
    TokenTypes.Lt = '<';
    TokenTypes.Rt = '>';
    TokenTypes.LtEq = '<=';
    TokenTypes.RtEq = '>=';
    TokenTypes.Plus = '+';
    TokenTypes.Minus = '-';
    TokenTypes.Times = '*';
    TokenTypes.Div = '/';
    TokenTypes.PostIncrement = '++';
    TokenTypes.PostDecrement = '--';
    // Reserved
    TokenTypes.Integer = 'integer';
    TokenTypes.Rune = 'rune';
    TokenTypes.String = 'string';
    TokenTypes.Boolean = 'boolean';
    TokenTypes.User = 'user';
    TokenTypes.Repo = 'repo';
    TokenTypes.CiConfig = 'ciConfig';
    TokenTypes.Deployment = 'deployment';
    TokenTypes.Manifest = 'manifest';
    TokenTypes.If = 'if';
    TokenTypes.Else = 'else';
    TokenTypes.While = 'while';
    TokenTypes.Void = 'void';
    TokenTypes.Var = 'var';
    TokenTypes.Command = 'command';
    TokenTypes.Func = 'func';
    TokenTypes.Complex = 'complex';
    TokenTypes.Return = 'return';
    TokenTypes.Lparent = '(';
    TokenTypes.Rparent = ')';
    TokenTypes.Lbrace = '{';
    TokenTypes.Rbrace = '}';
    TokenTypes.Semi = ';';
    TokenTypes.Comma = ',';
    TokenTypes.Assign = '=';
    TokenTypes.Dot = '.';
})(TokenTypes = exports.TokenTypes || (exports.TokenTypes = {}));
var Token = (function () {
    function Token(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
    Token.prototype.getType = function () {
        return this.type;
    };
    Token.prototype.getLine = function () {
        return this.line;
    };
    Token.prototype.getValue = function () {
        return this.value;
    };
    Token.prototype.getColumn = function () {
        return this.column;
    };
    return Token;
}());
exports.Token = Token;
