"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semantic_1 = require("./semantic");
var complexType_1 = require("./ast/complexType");
var stdlib_1 = require("./stdlib");
var func_1 = require("./ast/func");
var returnStatement_1 = require("./ast/returnStatement");
var varDeclaration_1 = require("./ast/varDeclaration");
var ifStatement_1 = require("./ast/ifStatement");
var assignStatement_1 = require("./ast/assignStatement");
var funcCallStatement_1 = require("./ast/funcCallStatement");
var ComplexAssignStatement_1 = require("./ast/ComplexAssignStatement");
var Interpreter = (function () {
    function Interpreter(input) {
        this.semanticAnalyzer = new semantic_1.SemanticAnalyzer(input);
        this.semanticAnalyzer.analyzeFile();
        this.ast = this.semanticAnalyzer.getAst();
        this.complexTypeDeclarations = stdlib_1.exportComplexTypeDeclarations();
        // TODO: Load reserved complex types
        this.declarations = [];
        this.functionDeclarations = stdlib_1.exportFuncDeclarations();
    }
    Interpreter.prototype.interpret = function (s, scope) {
        if (s instanceof complexType_1.ComplexType) {
            this.declareComplexType(s);
        }
        if (s instanceof func_1.Func) {
            this.declareFunction(s);
        }
        if (s instanceof returnStatement_1.ReturnStatement) {
            return this.interpretReturn(s, scope);
        }
        if (s instanceof varDeclaration_1.VarDeclaration) {
            this.declareVar(s, scope);
        }
        if (s instanceof ifStatement_1.IfStatement) {
            return this.interpretIf(s, scope);
        }
        // TODO
        /*if (s instanceof WhileStatement) {
            this.interpretWhile();
        }*/
        /*if (s instanceof PostDecrementStatement || s instanceof PostIncrementStatement) {
            this.checkPostOp(s, scope);
        }*/
        if (s instanceof assignStatement_1.AssignStatement) {
            this.interpretAssign(s, scope);
        }
        if (s instanceof ComplexAssignStatement_1.ComplexAssignStatement) {
            this.interpretComplexAssign(s, scope);
        }
        /*if (s instanceof AccessAssignStatement) {
            this.checkAccessAssign(s, scope);
        }*/
        if (s instanceof funcCallStatement_1.FuncCallStatement) {
            this.interpretFuncCall(s, scope);
        }
    };
    Interpreter.prototype.interpretFile = function () {
        for (var _i = 0, _a = this.ast; _i < _a.length; _i++) {
            var s = _a[_i];
            this.interpret(s, null);
        }
    };
    Interpreter.prototype.getVar = function (id, s) {
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
    Interpreter.prototype.declareComplexType = function (s) {
        this.complexTypeDeclarations.push(s);
    };
    Interpreter.prototype.declareFunction = function (s) {
        this.functionDeclarations.push(s);
    };
    Interpreter.prototype.declareVar = function (dec, scope) {
        if (scope) {
            // Variables can be local
            scope.declarations.push(dec);
        }
        else {
            // Global (file scope) var
            this.declarations.push(dec);
        }
    };
    Interpreter.prototype.interpretReturn = function (s, sc) {
        return s.evaluateValue(sc);
    };
    Interpreter.prototype.getFunc = function (id, s) {
        var func = this.functionDeclarations.find(function (f) { return f.getId() === id; });
        return func;
    };
    Interpreter.prototype.interpretFuncCall = function (s, scope) {
        // Prepare params and call interpretFunc
        if (!scope) {
            scope = { interpreter: this, declarations: this.declarations };
        }
        var funcDec = this.getFunc(s.getFuncId().getValue(), scope);
        var callParams = s.getParams();
        var funcParams = funcDec.getParams();
        if (funcDec.getNativeFunc()) {
            var nativeFunc = funcDec.getNativeFunc();
            var evaluatedParams = callParams.map(function (p) { return p.evaluateValue(scope); });
            var result = nativeFunc.apply(null, evaluatedParams);
            return result;
        }
        // Non-native func
        // Convert call params to var declarations
        var paramDeclarations = callParams.map(function (p, i) {
            return new varDeclaration_1.VarDeclaration(funcParams[i].getType(), funcParams[i].getId(), p.evaluateValue(scope));
        });
        return this.interpretFunc(funcDec, paramDeclarations, scope);
    };
    Interpreter.prototype.interpretFunc = function (f, params, s) {
        // Setup scope and call interpreter
        var bodyScope = {
            declarations: params.slice(),
            returns: [],
            assigns: [],
            statements: [],
            retType: f.getReturnType(),
            interpreter: this,
            parentContext: s,
        };
        var returnValue = null;
        for (var _i = 0, _a = f.getBody().getStatementsList(); _i < _a.length; _i++) {
            var st = _a[_i];
            var val = this.interpret(st, bodyScope);
            if (val) {
                returnValue = val;
                return returnValue;
            }
        }
    };
    Interpreter.prototype.interpretIf = function (i, scope) {
        if (!scope) {
            scope = { interpreter: this, declarations: this.declarations };
        }
        var conditionValue = i.getCondExp().evaluateValue(scope);
        var ifScope = {
            declarations: [],
            returns: [],
            assigns: [],
            statements: [],
            retType: scope.retType,
            interpreter: this,
            parentContext: scope,
        };
        var returnValue = null;
        if (conditionValue) {
            // go into true block
            for (var _i = 0, _a = i.getTrueStmArr(); _i < _a.length; _i++) {
                var st = _a[_i];
                var val = this.interpret(st, ifScope);
                if (val) {
                    returnValue = val;
                    return returnValue;
                }
            }
        }
        else {
            if (i.hasFalseBlock()) {
                // go into false block
                for (var _b = 0, _c = i.getTrueStmArr(); _b < _c.length; _b++) {
                    var st = _c[_b];
                    var val = this.interpret(st, ifScope);
                    if (val) {
                        returnValue = val;
                        return returnValue;
                    }
                }
            }
        }
        return returnValue;
    };
    Interpreter.prototype.interpretAssign = function (s, scope) {
        var varId = s.getId().getValue();
        var varDec = this.getVar(varId, scope);
        var value = null;
        if (scope) {
            value = s.getValue().evaluateValue(scope);
        }
        else {
            value = s.getValue().evaluateValue({ interpreter: this, declarations: this.declarations });
        }
        varDec.setValue(value);
    };
    Interpreter.prototype.interpretComplexAssign = function (s, scope) {
        var varId = s.getId().getValue();
        var varDec = this.getVar(varId, scope);
        var objectValue = {};
        for (var _i = 0, _a = s.getValues(); _i < _a.length; _i++) {
            var a = _a[_i];
            var value = null;
            if (scope) {
                value = a.assignment.evaluateValue(scope);
            }
            else {
                value = a.assignment.evaluateValue({ interpreter: this, declarations: this.declarations });
            }
            objectValue[a.field] = value;
        }
        varDec.setValue(objectValue);
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
