"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assignStatement_1 = require("../ast/assignStatement");
var block_1 = require("../ast/block");
var fieldAccessExpression_1 = require("../ast/fieldAccessExpression");
var func_1 = require("../ast/func");
var funcCallExpression_1 = require("../ast/funcCallExpression");
var functionParameter_1 = require("../ast/functionParameter");
var identifier_1 = require("../ast/identifier");
var identifierExpression_1 = require("../ast/identifierExpression");
var returnStatement_1 = require("../ast/returnStatement");
var varDeclaration_1 = require("../ast/varDeclaration");
var statements = [
    new varDeclaration_1.VarDeclaration("boolean", "urlValid"),
    new assignStatement_1.AssignStatement(new identifier_1.Identifier("urlValid"), new funcCallExpression_1.FuncCallExpression("validateUrl", [new fieldAccessExpression_1.FieldAccessExpression(new identifierExpression_1.IdentifierExpression("r"), new identifierExpression_1.IdentifierExpression("url"))])),
    new returnStatement_1.ReturnStatement(new identifierExpression_1.IdentifierExpression("urlValid")),
];
exports.ValidateRepoDec = new func_1.Func("validateRepo", [new functionParameter_1.FunctionParameter("repo", "r")], new block_1.BlockStatement(statements), "boolean");
