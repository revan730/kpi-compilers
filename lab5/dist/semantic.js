"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var accessAssignStatement_1 = require("./ast/accessAssignStatement");
var assignStatement_1 = require("./ast/assignStatement");
var complexType_1 = require("./ast/complexType");
var func_1 = require("./ast/func");
var funcCallStatement_1 = require("./ast/funcCallStatement");
var ifStatement_1 = require("./ast/ifStatement");
var postDecrement_1 = require("./ast/postDecrement");
var postIncrement_1 = require("./ast/postIncrement");
var returnStatement_1 = require("./ast/returnStatement");
var varDeclaration_1 = require("./ast/varDeclaration");
var whileStatement_1 = require("./ast/whileStatement");
var CharUtils = require("./charUtils");
var parser_1 = require("./parser");
var stdlib_1 = require("./stdlib");
var token_1 = require("./token");
var ComplexAssignStatement_1 = require("./ast/ComplexAssignStatement");
var SemanticAnalyzer = (function () {
    function SemanticAnalyzer(input) {
        this.parser = new parser_1.Parser(input);
    }
    SemanticAnalyzer.prototype.analyze = function (s, scope) {
        if (s instanceof complexType_1.ComplexType) {
            this.checkComplexType(s, scope);
        }
        if (s instanceof func_1.Func) {
            this.checkFunction(s, scope);
        }
        if (s instanceof returnStatement_1.ReturnStatement) {
            this.checkReturn(s, scope, scope.retType);
        }
        if (s instanceof varDeclaration_1.VarDeclaration) {
            this.checkVariableDeclaration(s, scope);
        }
        if (s instanceof ifStatement_1.IfStatement) {
            this.checkIf(s, scope);
        }
        if (s instanceof whileStatement_1.WhileStatement) {
            this.checkWhile(s, scope);
        }
        if (s instanceof postDecrement_1.PostDecrementStatement || s instanceof postIncrement_1.PostIncrementStatement) {
            this.checkPostOp(s, scope);
        }
        if (s instanceof assignStatement_1.AssignStatement) {
            this.checkAssign(s, scope);
        }
        if (s instanceof ComplexAssignStatement_1.ComplexAssignStatement) {
            this.checkComplexAssign(s, scope);
        }
        if (s instanceof accessAssignStatement_1.AccessAssignStatement) {
            this.checkAccessAssign(s, scope);
        }
        if (s instanceof funcCallStatement_1.FuncCallStatement) {
            this.checkFuncCall(s, scope);
        }
    };
    SemanticAnalyzer.prototype.getAst = function () {
        return this.statements;
    };
    SemanticAnalyzer.prototype.analyzeFile = function () {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = stdlib_1.exportComplexTypeDeclarations();
        this.functionDeclarations = stdlib_1.exportFuncDeclarations();
        this.assigns = [];
        this.declarations = [];
        for (var _i = 0, _a = this.statements; _i < _a.length; _i++) {
            var s = _a[_i];
            this.analyze(s, null);
        }
    };
    SemanticAnalyzer.prototype.findFunctionDeclaration = function (id, s) {
        // Functions are global, so no need to traverse local scopes
        var func = this.functionDeclarations.find(function (f) { return f.getId() === id; });
        if (!func) {
            throw new Error("SH??: Function with id " + id + " not declared");
        }
        return func;
    };
    SemanticAnalyzer.prototype.findVariableDeclaration = function (id, s) {
        // Traverse through scopes
        var currentScope = s;
        while (currentScope !== null) {
            var varDec_1 = currentScope.declarations.find(function (d) { return d.getId() === id; });
            if (varDec_1) {
                return varDec_1;
            }
            currentScope = currentScope.parentContext;
        }
        // In file context
        var varDec = this.declarations.find(function (d) { return d.getId() === id; });
        return varDec;
    };
    SemanticAnalyzer.prototype.findComplexFieldDeclaration = function (complexTypeId, fieldId, s) {
        // Find VARIABLE with compexTypeId, check if it's complex, then check it's field type
        var complex = this.findVariableDeclaration(complexTypeId, s);
        if (!complex) {
            throw new Error("SH??: Complex type variable with id '" + complexTypeId + "' not found");
        }
        var complexType = this.complexTypeDeclarations.find(function (ct) { return ct.getId() === complex.getType(); });
        if (!complexType) {
            throw new Error("SH??: Complex type '" + complex.getType() + "' not declared");
        }
        var field = complexType.getFields().find(function (f) { return f.getId() === fieldId; });
        if (!field) {
            throw new Error("SH??: Complex type '" + complexTypeId + "' has no field " + fieldId);
        }
        return field;
    };
    SemanticAnalyzer.prototype.checkComplexTypeFields = function (complexID, fields) {
        var identifiers = [];
        var _loop_1 = function (s) {
            var fieldType = s.getType();
            var id = s.getId();
            // SH04: Unknown type
            var isReserved = !CharUtils.isIdentifierReserved(fieldType);
            if (isReserved && !this_1.complexTypeDeclarations.find(function (ct) { return ct.getId() === fieldType; })) {
                throw new Error("SH04: Unknown type " + fieldType);
            }
            if (identifiers.indexOf(id) > -1) {
                throw new Error("SH05: Field with id " + id + " already declared for " + complexID);
            }
            identifiers.push(id);
        };
        var this_1 = this;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var s = fields_1[_i];
            _loop_1(s);
        }
    };
    SemanticAnalyzer.prototype.checkComplexType = function (c, scope) {
        var id = c.getId();
        var fields = c.getFields();
        // SH01: Complex type already defined
        if (this.complexTypeDeclarations.find(function (ct) { return ct.getId() === id; })) {
            throw new Error("SH01: Complex type " + id + " already declared");
        }
        // SH02: Reserved identifier
        if (CharUtils.isIdentifierReserved(id)) {
            throw new Error("SH02: Reserved indentifier " + id);
        }
        // SH03: Empty complex type declaration
        if (fields.length === 0) {
            throw new Error("SH03: Empty complex type " + id + " declaration");
        }
        this.checkComplexTypeFields(id, fields);
        this.complexTypeDeclarations.push(c);
    };
    SemanticAnalyzer.prototype.checkComplexAssign = function (s, scope) {
        var id = s.getId().getValue();
        var fieldAssignments = s.getValues();
        for (var _i = 0, fieldAssignments_1 = fieldAssignments; _i < fieldAssignments_1.length; _i++) {
            var a = fieldAssignments_1[_i];
            var fieldDec = this.findComplexFieldDeclaration(id, a.field, scope);
            var assignType = a.assignment.evaluateType(scope);
            var fieldType = fieldDec.getType();
            if (fieldType !== a.assignment.evaluateType(scope)) {
                throw new Error("SH18: Trying to assign " + assignType + " to " + fieldType + " field " + a.field + " of " + id + " var");
            }
        }
    };
    SemanticAnalyzer.prototype.checkReturn = function (r, scope, funcType) {
        var retType = r.evaluateType(scope);
        // SH08 Return type doesn't match with function's
        if (retType !== funcType) {
            throw new Error("SH08: Type " + retType + " doesn't match with " + funcType + " ");
        }
    };
    SemanticAnalyzer.prototype.checkVariableDeclaration = function (dec, scope) {
        var id = dec.getId();
        var type = dec.getType();
        if (this.findVariableDeclaration(id, scope)) {
            throw new Error("SH10: Variable with id " + id + " already declared");
        }
        var isReserved = !CharUtils.isIdentifierReserved(type);
        if (isReserved && !this.complexTypeDeclarations.find(function (ct) { return ct.getId() === type; })) {
            throw new Error("SH04: Unknown type " + type);
        }
        if (scope) {
            // Variables can be local
            scope.declarations.push(dec);
        }
        else {
            // Global (file scope) var
            this.declarations.push(dec);
        }
    };
    SemanticAnalyzer.prototype.checkIf = function (st, sc) {
        var condType = st.getCondExp().evaluateType(sc);
        var trueBody = st.getTrueStmArr();
        if (condType !== token_1.TokenTypes.Boolean) {
            throw new Error("SH11: If statement's condition type is " + condType + " but boolean expected");
        }
        // Descend into true branch body
        var trueScope = {
            declarations: [],
            returns: [],
            assigns: [],
            statements: [],
            retType: sc.retType,
            analyzer: this,
            parentContext: sc,
        };
        for (var _i = 0, trueBody_1 = trueBody; _i < trueBody_1.length; _i++) {
            var s = trueBody_1[_i];
            this.analyze(s, trueScope);
        }
        // Descend into false branch body
        if (st.hasFalseBlock()) {
            var falseBody = st.getFalseStmArr();
            var falseScope = {
                assigns: [],
                declarations: [],
                returns: [],
                statements: [],
                retType: sc.retType,
                analyzer: this,
                parentContext: sc,
            };
            for (var _a = 0, falseBody_1 = falseBody; _a < falseBody_1.length; _a++) {
                var s = falseBody_1[_a];
                this.analyze(s, falseScope);
            }
        }
    };
    SemanticAnalyzer.prototype.checkPostOp = function (st, sc) {
        var varId = st.getId().getValue();
        var varDec = this.findVariableDeclaration(varId, sc);
        if (!varDec) {
            throw new Error("SH13: Var " + varId + " not found");
        }
        if (varDec.getType() !== token_1.TokenTypes.Integer) {
            throw new Error("SH14: Post op called for " + varDec.getType() + " but integer expected");
        }
    };
    SemanticAnalyzer.prototype.checkAssign = function (st, sc) {
        var varId = st.getId().getValue();
        var varDec = this.findVariableDeclaration(varId, sc);
        var assignType = null;
        if (sc) {
            assignType = st.getValue().evaluateType(sc);
        }
        else {
            assignType = st.getValue().evaluateType({ analyzer: this });
        }
        if (!varDec) {
            throw new Error("SH15: Trying to assign " + varId + " but it's not declared");
        }
        if (varDec.getType() !== assignType) {
            throw new Error("SH16: Trying to assign " + assignType + " to " + varDec.getType() + " variable");
        }
    };
    SemanticAnalyzer.prototype.checkAccessAssign = function (st, sc) {
        var varId = st.getComplexId();
        var varDec = this.findVariableDeclaration(varId, sc);
        var assignType = st.getValue().evaluateType(sc);
        var fieldId = st.getFieldId();
        if (!varDec) {
            throw new Error("SH17: Trying to assign complex var " + varId + " but it's not declared");
        }
        var fieldType = this.findComplexFieldDeclaration(varId, fieldId, sc).getType();
        if (fieldType !== assignType) {
            throw new Error("SH18: Trying to assign " + assignType + " to " + fieldType + " field " + fieldId + " of " + varId + " var");
        }
    };
    SemanticAnalyzer.prototype.checkFuncCall = function (st, sc) {
        var funcId = st.getFuncId().getValue();
        var funcDec = this.findFunctionDeclaration(funcId, sc);
        var funcParams = funcDec.getParams();
        var callParams = st.getParams();
        if (!funcDec) {
            throw new Error("SH19: Trying to call func " + funcId + " but it's not declared");
        }
        // Check if parameter count match
        if (funcParams.length !== callParams.length) {
            throw new Error("SH20: Func " + funcId + " has " + funcParams.length + " params, called with " + callParams.length);
        }
        // Check if parameter types match
        for (var i = 0; i < funcParams.length; i++) {
            var expectedType = funcParams[i].getType();
            var actualType = null;
            if (sc) {
                actualType = callParams[i].evaluateType(sc);
            }
            else {
                actualType = callParams[i].evaluateType({ analyzer: this, declarations: this.declarations });
            }
            if (expectedType !== actualType) {
                throw new Error("SH21: Param at index " + (i + 1) + " expected to have type " + expectedType + ", got " + actualType);
            }
        }
    };
    SemanticAnalyzer.prototype.checkWhile = function (st, sc) {
        var condType = st.getCondExp().evaluateType(sc);
        var body = st.getLoopStm();
        if (condType !== token_1.TokenTypes.Boolean) {
            throw new Error("SH12: While statement's condition type is " + condType + " but boolean expected");
        }
        // Check if it will not loop forever
        var expressionIdentifiers = st.getCondExp().getIdentifiers();
        var atLeastOneIdUsed = false;
        var _loop_2 = function (s) {
            if (s instanceof assignStatement_1.AssignStatement
                || s instanceof postDecrement_1.PostDecrementStatement || s instanceof postIncrement_1.PostIncrementStatement) {
                if (expressionIdentifiers.find(function (e) { return e === s.getId().getValue(); })) {
                    atLeastOneIdUsed = true;
                }
            }
        };
        for (var _i = 0, _a = st.getLoopStm(); _i < _a.length; _i++) {
            var s = _a[_i];
            _loop_2(s);
        }
        if (!atLeastOneIdUsed) {
            console.log("SH13: Possible endless while loop");
        }
        // Descend into body
        var bodyScope = {
            declarations: [],
            returns: [],
            assigns: [],
            statements: [],
            retType: sc.retType,
            analyzer: this,
            parentContext: sc,
        };
        for (var _b = 0, body_1 = body; _b < body_1.length; _b++) {
            var s = body_1[_b];
            this.analyze(s, bodyScope);
        }
    };
    SemanticAnalyzer.prototype.checkFunctionParameters = function (funcID, params) {
        var identifiers = [];
        var _loop_3 = function (s) {
            var paramType = s.getType();
            var id = s.getId();
            // SH04: Unknown type
            var isReserved = !CharUtils.isIdentifierReserved(paramType);
            if (isReserved && !this_2.complexTypeDeclarations.find(function (ct) { return ct.getId() === paramType; })) {
                throw new Error("SH04: Unknown type " + paramType);
            }
            if (identifiers.indexOf(id) > -1) {
                throw new Error("SH09: Param with id " + id + " already declared for " + funcID);
            }
            identifiers.push(id);
        };
        var this_2 = this;
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var s = params_1[_i];
            _loop_3(s);
        }
    };
    SemanticAnalyzer.prototype.checkFunction = function (f, scope) {
        var id = f.getId();
        var params = f.getParams();
        var body = f.getBody().getStatementsList();
        var retType = f.getReturnType();
        // SH06: Function already defined
        if (this.functionDeclarations.find(function (f) { return f.getId() === id; })) {
            throw new Error("SH06: Function " + id + " already declared");
        }
        // SH02: Reserved identifier
        if (CharUtils.isIdentifierReserved(id)) {
            throw new Error("SH02: Reserved indentifier " + id);
        }
        // SH04: Unknown type
        if (retType) {
            var isReserved = !CharUtils.isIdentifierReserved(retType);
            if (isReserved && !this.complexTypeDeclarations.find(function (ct) { return ct.getId() === retType; })) {
                throw new Error("SH04: Unknown type " + retType);
            }
        }
        this.checkFunctionParameters(id, params);
        // Descend into function body
        var bodyScope = {
            declarations: params.slice(),
            returns: [],
            assigns: [],
            statements: [],
            retType: retType,
            analyzer: this,
            parentContext: null,
        };
        for (var _i = 0, body_2 = body; _i < body_2.length; _i++) {
            var s = body_2[_i];
            this.analyze(s, bodyScope);
        }
        this.functionDeclarations.push(f);
    };
    return SemanticAnalyzer;
}());
exports.SemanticAnalyzer = SemanticAnalyzer;
