"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var CharUtils = require("./charUtils");
var lexer_1 = require("./lexer");
var varDeclaration_1 = require("./ast/varDeclaration");
var integerLiteral_1 = require("./ast/integerLiteral");
var booleanLiteral_1 = require("./ast/booleanLiteral");
var identifierExpression_1 = require("./ast/identifierExpression");
var stringLiteral_1 = require("./ast/stringLiteral");
var runeLiteral_1 = require("./ast/runeLiteral");
var notExpression_1 = require("./ast/notExpression");
var negativeExpression_1 = require("./ast/negativeExpression");
var AndExpression_1 = require("./ast/AndExpression");
var OrExpression_1 = require("./ast/OrExpression");
var EqualExpression_1 = require("./ast/EqualExpression");
var notEqualExpression_1 = require("./ast/notEqualExpression");
var lessThanExpression_1 = require("./ast/lessThanExpression");
var greaterThanExpression_1 = require("./ast/greaterThanExpression");
var lessThanEqualExpression_1 = require("./ast/lessThanEqualExpression");
var greaterThanEqualExpression_1 = require("./ast/greaterThanEqualExpression");
var plusExpression_1 = require("./ast/plusExpression");
var minusExpression_1 = require("./ast/minusExpression");
var timesExpression_1 = require("./ast/timesExpression");
var divExpression_1 = require("./ast/divExpression");
var ifStatement_1 = require("./ast/ifStatement");
var identifier_1 = require("./ast/identifier");
var assignStatement_1 = require("./ast/assignStatement");
var block_1 = require("./ast/block");
var complexField_1 = require("./ast/complexField");
var complexType_1 = require("./ast/complexType");
var functionParameter_1 = require("./ast/functionParameter");
var func_1 = require("./ast/func");
var returnStatement_1 = require("./ast/returnStatement");
var ComplexAssignStatement_1 = require("./ast/ComplexAssignStatement");
var postIncrement_1 = require("./ast/postIncrement");
var postDecrement_1 = require("./ast/postDecrement");
var fieldAccessExpression_1 = require("./ast/fieldAccessExpression");
var accessAssignStatement_1 = require("./ast/accessAssignStatement");
var whileStatement_1 = require("./ast/whileStatement");
var funcCallStatement_1 = require("./ast/funcCallStatement");
var funcCallExpression_1 = require("./ast/funcCallExpression");
var Parser = (function () {
    function Parser(input) {
        this.initBinopLevels();
        this.lexer = new lexer_1.Lexer(input);
        this.identifiers = [];
        this.complexTypes = [];
        this.functions = [];
        this.tokens = this.lexer.allTokens();
        this.currentToken = 0;
        this.token = this.tokens[this.currentToken];
        this.errors = 0;
    }
    Parser.prototype.initBinopLevels = function () {
        this.binopLevels = {};
        this.binopLevels[token_1.TokenTypes.And] = 10;
        this.binopLevels[token_1.TokenTypes.Or] = 10;
        this.binopLevels[token_1.TokenTypes.Lt] = 20;
        this.binopLevels[token_1.TokenTypes.Rt] = 20;
        this.binopLevels[token_1.TokenTypes.LtEq] = 20;
        this.binopLevels[token_1.TokenTypes.RtEq] = 20;
        this.binopLevels[token_1.TokenTypes.Eq] = 20;
        this.binopLevels[token_1.TokenTypes.Neq] = 20;
        this.binopLevels[token_1.TokenTypes.Plus] = 30;
        this.binopLevels[token_1.TokenTypes.Minus] = 30;
        this.binopLevels[token_1.TokenTypes.Times] = 40;
        this.binopLevels[token_1.TokenTypes.Div] = 40;
        this.binopLevels[token_1.TokenTypes.Dot] = 45;
        this.binopLevels[token_1.TokenTypes.Lbrace] = 50;
    };
    Parser.prototype.error = function (expectedType) {
        var token = this.tokens[this.currentToken];
        if (token == this.errorToken)
            return;
        console.log("ERROR: " + token.getType(), " at line " + token.getLine() + ", column " + token.getColumn(), "; Expected " + expectedType);
        this.errorToken = token;
        this.errors++;
        throw new Error("Unexpected token type " + token.getType() + " expected " + expectedType);
    };
    Parser.prototype.eatToken = function (expectedType) {
        var actualType = this.token.getType();
        if (expectedType === actualType) {
            this.nextToken();
            return true;
        }
        else {
            this.error(expectedType);
            return false;
        }
    };
    Parser.prototype.nextToken = function () {
        this.currentToken += 1;
        this.token = this.tokens[this.currentToken];
    };
    Parser.prototype.skipTo = function (follow) {
        while (this.token.getType() != token_1.TokenTypes.EOF) {
            for (var _i = 0, follow_1 = follow; _i < follow_1.length; _i++) {
                var skip = follow_1[_i];
                if (this.token.getType() == skip)
                    return;
            }
            this.nextToken();
        }
    };
    Parser.prototype.rewind = function () {
        this.currentToken = 0;
        this.token = this.tokens[this.currentToken];
    };
    Parser.prototype.parseProgram = function () {
        this.statements = this.parseStatementList();
        this.eatToken(token_1.TokenTypes.EOF);
        return this.statements;
    };
    // integer | rune | string | boolean | complexUserOrReserved
    // reservedComplexType ::= user | repo | ciConfig | deployment | manifest
    // complexUserOrReserved ::= “complex” identifier | reservedComplexType
    Parser.prototype.parseType = function () {
        var token = this.tokens[this.currentToken];
        switch (token.getType()) {
            case token_1.TokenTypes.Integer:
                this.eatToken(token_1.TokenTypes.Integer);
                return token_1.TokenTypes.Integer;
            case token_1.TokenTypes.Boolean:
                this.eatToken(token_1.TokenTypes.Boolean);
                return token_1.TokenTypes.Boolean;
            case token_1.TokenTypes.Rune:
                this.eatToken(token_1.TokenTypes.Rune);
                return token_1.TokenTypes.Rune;
            case token_1.TokenTypes.String:
                this.eatToken(token_1.TokenTypes.String);
                return token_1.TokenTypes.String;
            case token_1.TokenTypes.User:
                this.eatToken(token_1.TokenTypes.User);
                return token_1.TokenTypes.User;
            case token_1.TokenTypes.Repo:
                this.eatToken(token_1.TokenTypes.Repo);
                return token_1.TokenTypes.Repo;
            case token_1.TokenTypes.CiConfig:
                this.eatToken(token_1.TokenTypes.CiConfig);
                return token_1.TokenTypes.CiConfig;
            case token_1.TokenTypes.Deployment:
                this.eatToken(token_1.TokenTypes.Deployment);
                return token_1.TokenTypes.Deployment;
            case token_1.TokenTypes.Manifest:
                this.eatToken(token_1.TokenTypes.Manifest);
                return token_1.TokenTypes.Manifest;
            case token_1.TokenTypes.Complex:
                this.eatToken(token_1.TokenTypes.Complex);
                token = this.tokens[this.currentToken];
                this.eatToken(token_1.TokenTypes.Identifier);
                return token.getValue();
            default:
                // unknown type
                throw new Error("Unknown type " +
                    token.getValue() +
                    " at line " +
                    token.getLine() +
                    " column " +
                    token.getColumn());
        }
    };
    Parser.prototype.parseIdentifier = function () {
        var token = this.tokens[this.currentToken];
        var identifier = "";
        // grab ID value if token type is ID
        if (token.getType() == token_1.TokenTypes.Identifier)
            identifier = token.getValue();
        this.eatToken(token_1.TokenTypes.Identifier);
        return identifier;
    };
    Parser.prototype.parseStatementList = function () {
        this.skipTo([
            token_1.TokenTypes.Semi,
            token_1.TokenTypes.If,
            token_1.TokenTypes.While,
            token_1.TokenTypes.Lparent,
            token_1.TokenTypes.Lbrace,
            token_1.TokenTypes.Identifier,
            token_1.TokenTypes.Complex,
            token_1.TokenTypes.Func,
            token_1.TokenTypes.Command,
            token_1.TokenTypes.Var
        ]);
        var statementList = [];
        while (this.isStatement())
            statementList.push(this.parseStatement());
        return statementList;
    };
    Parser.prototype.isStatement = function () {
        switch (this.token.getType()) {
            case token_1.TokenTypes.Semi:
                return true;
            case token_1.TokenTypes.If:
                return true;
            case token_1.TokenTypes.While:
                return true;
            case token_1.TokenTypes.Lparent:
                return true;
            case token_1.TokenTypes.Lbrace:
                return true;
            case token_1.TokenTypes.Identifier:
                return true;
            case token_1.TokenTypes.Complex:
                return true;
            case token_1.TokenTypes.Command:
                return true;
            case token_1.TokenTypes.Func:
                return true;
            case token_1.TokenTypes.Var:
                return true;
            default:
                return false;
        }
    };
    Parser.prototype.parseBlock = function () {
        this.eatToken(token_1.TokenTypes.Lbrace);
        // recursively call parseStatement() until closing brace
        var stms = [];
        while (this.token.getType() != token_1.TokenTypes.Rbrace &&
            this.token.getType() != token_1.TokenTypes.EOF)
            stms.push(this.parseStatement());
        if (!this.eatToken(token_1.TokenTypes.Rbrace)) {
            this.skipTo([token_1.TokenTypes.Rbrace]);
            this.eatToken(token_1.TokenTypes.Rbrace);
        }
        return new block_1.BlockStatement(stms);
    };
    // type identifier
    Parser.prototype.parseComplexField = function () {
        var type = this.parseType();
        var id = this.parseIdentifier();
        this.eatToken(token_1.TokenTypes.Semi);
        return new complexField_1.ComplexField(type, id);
    };
    // type identifier
    Parser.prototype.parseFuncParameter = function () {
        var type = this.parseType();
        var id = this.parseIdentifier();
        return new functionParameter_1.FunctionParameter(type, id);
    };
    Parser.prototype.parseComplexFields = function () {
        this.eatToken(token_1.TokenTypes.Lbrace);
        var fields = [];
        while (this.token.getType() != token_1.TokenTypes.Rbrace &&
            this.token.getType() != token_1.TokenTypes.EOF)
            fields.push(this.parseComplexField());
        this.eatToken(token_1.TokenTypes.Rbrace);
        return fields;
    };
    // “void” | type identifier {‘,’ type identifier}
    Parser.prototype.parseFuncParameters = function () {
        this.eatToken(token_1.TokenTypes.Lparent);
        if (this.token.getType() === token_1.TokenTypes.Void) {
            // No params, skipping 'void)'
            this.eatToken(token_1.TokenTypes.Void);
            this.eatToken(token_1.TokenTypes.Rparent);
            return [];
        }
        // Parse first parameter
        var param = this.parseFuncParameter();
        var params = [param];
        while (this.token.getType() === token_1.TokenTypes.Comma) {
            this.eatToken(token_1.TokenTypes.Comma);
            params.push(this.parseFuncParameter());
        }
        this.eatToken(token_1.TokenTypes.Rparent);
        return params;
    };
    // expression {‘,’ expression}
    Parser.prototype.parseFuncCallParameters = function () {
        this.eatToken(token_1.TokenTypes.Lparent);
        if (this.token.getType() === token_1.TokenTypes.Rparent) {
            // No params, skipping ')'
            this.eatToken(token_1.TokenTypes.Rparent);
            return [];
        }
        // Parse first parameter
        var param = this.parseExp();
        var params = [param];
        while (this.token.getType() === token_1.TokenTypes.Comma) {
            this.eatToken(token_1.TokenTypes.Comma);
            params.push(this.parseExp());
        }
        this.eatToken(token_1.TokenTypes.Rparent);
        return params;
    };
    Parser.prototype.parseFieldAssignment = function () {
        var id = this.parseIdentifier();
        this.eatToken(token_1.TokenTypes.Assign);
        var value = this.parseExp();
        this.eatToken(token_1.TokenTypes.Semi);
        return { field: id, assignment: value };
    };
    Parser.prototype.parseStatement = function () {
        // IfStatement ::=  if '('Exp')' Statement [else Statement]
        if (this.token.getType() == token_1.TokenTypes.If) {
            this.eatToken(token_1.TokenTypes.If);
            // parse conditional expression
            if (!this.eatToken(token_1.TokenTypes.Lparent))
                this.skipTo([token_1.TokenTypes.Rparent, token_1.TokenTypes.Lbrace, token_1.TokenTypes.Rbrace]);
            var condExp = this.parseExp();
            if (!this.eatToken(token_1.TokenTypes.Rparent))
                this.skipTo([token_1.TokenTypes.Lbrace, token_1.TokenTypes.Semi, token_1.TokenTypes.Rbrace]);
            // parse true and false statements
            var trueStm = void 0;
            // BLock ::= '{' StatementList '}'
            if (this.token.getType() == token_1.TokenTypes.Lbrace)
                trueStm = this.parseBlock();
            else
                trueStm = this.parseStatement();
            if (this.token.getType() == token_1.TokenTypes.Else) {
                if (!this.eatToken(token_1.TokenTypes.Else))
                    this.skipTo([token_1.TokenTypes.Lbrace, token_1.TokenTypes.Semi, token_1.TokenTypes.Rbrace]);
                var falseStm = void 0;
                // BLock ::= '{' StatementList '}'
                if (this.token.getType() == token_1.TokenTypes.Lbrace)
                    falseStm = this.parseBlock();
                else
                    falseStm = this.parseStatement();
                return new ifStatement_1.IfStatement(condExp, trueStm, falseStm);
            }
            return new ifStatement_1.IfStatement(condExp, trueStm, null);
        }
        // while ::= while '('Exp')' '{' statement {statement} '}'
        if (this.token.getType() == token_1.TokenTypes.While) {
            this.eatToken(token_1.TokenTypes.While);
            // parse looping condition
            if (!this.eatToken(token_1.TokenTypes.Lparent))
                this.skipTo([token_1.TokenTypes.Rparent, token_1.TokenTypes.Lbrace, token_1.TokenTypes.Rbrace]);
            var condExp = this.parseExp();
            if (!this.eatToken(token_1.TokenTypes.Rparent))
                this.skipTo([token_1.TokenTypes.Lbrace, token_1.TokenTypes.Semi, token_1.TokenTypes.Rbrace]);
            var loopStm = void 0;
            this.eatToken(token_1.TokenTypes.Lbrace);
            loopStm = this.parseStatementList();
            this.eatToken(token_1.TokenTypes.Rbrace);
            return new whileStatement_1.WhileStatement(condExp, loopStm);
        }
        if (this.token.getType() === token_1.TokenTypes.Var) {
            this.eatToken(token_1.TokenTypes.Var);
            var type = this.parseType();
            var id = this.parseIdentifier();
            this.eatToken(token_1.TokenTypes.Semi);
            return new varDeclaration_1.VarDeclaration(type, id);
        }
        // Identifier statement
        if (this.token.getType() == token_1.TokenTypes.Identifier) {
            var id = new identifier_1.Identifier(this.token.getValue());
            this.identifiers.push(id);
            this.eatToken(token_1.TokenTypes.Identifier);
            // Assignment statement: id = Exp ;
            if (this.token.getType() == token_1.TokenTypes.Assign) {
                this.eatToken(token_1.TokenTypes.Assign);
                // complex type assignment
                if (this.token.getType() === token_1.TokenTypes.Lbrace) {
                    this.eatToken(token_1.TokenTypes.Lbrace);
                    var values = [];
                    while (this.token.getType() != token_1.TokenTypes.Rbrace &&
                        this.token.getType() != token_1.TokenTypes.EOF)
                        values.push(this.parseFieldAssignment());
                    this.eatToken(token_1.TokenTypes.Rbrace);
                    return new ComplexAssignStatement_1.ComplexAssignStatement(id, values);
                }
                var value = this.parseExp();
                this.eatToken(token_1.TokenTypes.Semi);
                var assign = new assignStatement_1.AssignStatement(id, value);
                return assign;
            }
            // Postfix ops
            if (this.token.getType() === token_1.TokenTypes.PostIncrement ||
                this.token.getType() === token_1.TokenTypes.PostDecrement) {
                if (this.token.getType() === token_1.TokenTypes.PostDecrement) {
                    this.eatToken(token_1.TokenTypes.PostDecrement);
                    this.eatToken(token_1.TokenTypes.Semi);
                    return new postDecrement_1.PostDecrementStatement(id);
                }
                this.eatToken(token_1.TokenTypes.PostIncrement);
                this.eatToken(token_1.TokenTypes.Semi);
                return new postIncrement_1.PostIncrementStatement(id);
            }
            // field access with assignment
            if (this.token.getType() === token_1.TokenTypes.Dot) {
                this.eatToken(token_1.TokenTypes.Dot);
                var field = this.parseIdentifier();
                this.eatToken(token_1.TokenTypes.Assign);
                var value = this.parseExp();
                this.eatToken(token_1.TokenTypes.Semi);
                return new accessAssignStatement_1.AccessAssignStatement(id.getValue(), field, value);
            }
            // func call
            if (this.token.getType() === token_1.TokenTypes.Lparent) {
                var params = this.parseFuncCallParameters();
                this.eatToken(token_1.TokenTypes.Semi);
                return new funcCallStatement_1.FuncCallStatement(id, params);
            }
        }
        if (this.token.getType() === token_1.TokenTypes.Command ||
            this.token.getType() === token_1.TokenTypes.Func) {
            var isFunc = this.token.getType() === token_1.TokenTypes.Func;
            this.eatToken(this.token.getType());
            var type = null;
            if (isFunc) {
                // Parse return type
                type = this.parseType();
            }
            var funcName = this.parseIdentifier();
            // Parameter types list
            var params = this.parseFuncParameters();
            var funcBody = this.parseBlock();
            var func = new func_1.Func(funcName, params, funcBody, type);
            this.functions.push(func);
            return func;
        }
        if (this.token.getType() === token_1.TokenTypes.Return) {
            this.eatToken(token_1.TokenTypes.Return);
            // Looking to see if it's a void return;
            if (this.token.getType() === token_1.TokenTypes.Semi) {
                this.eatToken(token_1.TokenTypes.Semi);
                return new returnStatement_1.ReturnStatement(null);
            }
            var value = this.parseExp();
            this.eatToken(token_1.TokenTypes.Semi);
            return new returnStatement_1.ReturnStatement(value);
        }
        // Complex type specification statement
        if (this.token.getType() === token_1.TokenTypes.Complex) {
            this.eatToken(token_1.TokenTypes.Complex);
            var id = this.parseIdentifier();
            this.skipTo([token_1.TokenTypes.Lbrace]);
            var typeFields = this.parseComplexFields();
            var complexType = new complexType_1.ComplexType(id, typeFields);
            this.complexTypes.push(complexType);
            return complexType;
        }
        // statement type unknown
        this.eatToken(token_1.TokenTypes.Unknown);
        this.nextToken();
        return null;
    };
    Parser.prototype.parseExp = function () {
        var lhs = this.parsePrimaryExp();
        return this.parseBinopRHS(0, lhs); // check for binops following exp
    };
    Parser.prototype.parsePrimaryExp = function () {
        switch (this.token.getType()) {
            case token_1.TokenTypes.IntegerLiteral:
                var intValue = Number(this.token.getValue());
                this.eatToken(token_1.TokenTypes.IntegerLiteral);
                return new integerLiteral_1.IntegerLiteral(intValue);
            case token_1.TokenTypes.BooleanLiteral:
                var booleanVal = CharUtils.returnBooleanValue(this.token.getValue());
                this.eatToken(token_1.TokenTypes.BooleanLiteral);
                return new booleanLiteral_1.BooleanLiteral(booleanVal);
            case token_1.TokenTypes.RuneLiteral:
                var runeVal = this.token.getValue();
                this.eatToken(token_1.TokenTypes.RuneLiteral);
                return new runeLiteral_1.RuneLiteral(runeVal);
            case token_1.TokenTypes.StringLiteral:
                var stringVal = this.token.getValue();
                this.eatToken(token_1.TokenTypes.StringLiteral);
                return new stringLiteral_1.StringLiteral(stringVal);
            case token_1.TokenTypes.Identifier:
                var id = this.parseIdentifier();
                this.identifiers.push(id);
                // Check if it's a func call so func calls can be expressions
                if (this.token.getType() === token_1.TokenTypes.Lparent) {
                    var params = this.parseFuncCallParameters();
                    return new funcCallExpression_1.FuncCallExpression(id, params);
                }
                return new identifierExpression_1.IdentifierExpression(id);
            case token_1.TokenTypes.Not:
                this.eatToken(token_1.TokenTypes.Not);
                return new notExpression_1.NotExpression(this.parseExp());
            case token_1.TokenTypes.Minus:
                this.eatToken(token_1.TokenTypes.Minus);
                return new negativeExpression_1.NegativeExpression(this.parseExp());
            case token_1.TokenTypes.Lparent:
                this.eatToken(token_1.TokenTypes.Lparent);
                var exp = this.parseExp();
                this.eatToken(token_1.TokenTypes.Rparent);
                return exp;
            default:
                // unrecognizable expression
                this.eatToken(token_1.TokenTypes.Unknown);
                this.nextToken();
                return null;
        }
    };
    Parser.prototype.parseBinopRHS = function (level, lhs) {
        // continuously parse exp until a lower order operator comes up
        while (true) {
            // grab operator precedence (-1 for non-operator token)
            var val = this.binopLevels[this.token.getType()];
            var tokenLevel = val !== undefined ? val : -1;
            // either op precedence is lower than prev op or token is not an op
            if (tokenLevel < level)
                return lhs;
            // save binop before parsing rhs of exp
            var binop = this.token.getType();
            this.eatToken(binop);
            var rhs = this.parsePrimaryExp(); // parse rhs of exp
            // grab operator precedence (-1 for non-operator token)
            val = this.binopLevels[this.token.getType()];
            var nextLevel = val !== undefined ? val : -1;
            // if next op has higher precedence than prev op, make recursive call
            if (tokenLevel < nextLevel)
                rhs = this.parseBinopRHS(tokenLevel + 1, rhs);
            // build AST for exp
            switch (binop) {
                case token_1.TokenTypes.And:
                    lhs = new AndExpression_1.AndExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Or:
                    lhs = new OrExpression_1.OrExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Eq:
                    lhs = new EqualExpression_1.EqualExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Neq:
                    lhs = new notEqualExpression_1.NotEqualExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Lt:
                    lhs = new lessThanExpression_1.LessThanExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Rt:
                    lhs = new greaterThanExpression_1.GreaterThanExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.LtEq:
                    lhs = new lessThanEqualExpression_1.LessThanEqualExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.RtEq:
                    lhs = new greaterThanEqualExpression_1.GreaterThanEqualExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Plus:
                    lhs = new plusExpression_1.PlusExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Minus:
                    lhs = new minusExpression_1.MinusExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Times:
                    lhs = new timesExpression_1.TimesExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Div:
                    lhs = new divExpression_1.DivExpression(lhs, rhs);
                    break;
                case token_1.TokenTypes.Dot:
                    var idLhs = lhs;
                    var idRhs = rhs;
                    lhs = new fieldAccessExpression_1.FieldAccessExpression(idLhs, idRhs);
                    break;
                default:
                    this.eatToken(token_1.TokenTypes.Unknown);
                    break;
            }
        }
    };
    return Parser;
}());
exports.Parser = Parser;
