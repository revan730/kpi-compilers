import { Statement } from "./ast/statement";
import { SemanticAnalyzer } from "./semantic";
import { ComplexType } from "./ast/complexType";
import { exportFuncDeclarations, exportComplexTypeDeclarations } from "./stdlib";
import { Func } from "./ast/func";
import { ReturnStatement } from "./ast/returnStatement";
import { InterpreterScope } from "./interpreterScope";
import { Expression } from "./ast/expression";
import { VarDeclaration } from "./ast/varDeclaration";
import { IfStatement } from "./ast/ifStatement";
import { WhileStatement } from "./ast/whileStatement";
import { AssignStatement } from "./ast/assignStatement";
import { FuncCallStatement } from "./ast/funcCallStatement";
import { ComplexAssignStatement } from "./ast/ComplexAssignStatement";

export class Interpreter {
    private ast: Statement[];
    private complexTypeDeclarations: any;
    private functionDeclarations: any;
    private declarations: any;
    private semanticAnalyzer: SemanticAnalyzer;

    constructor(input: string) {
        this.semanticAnalyzer = new SemanticAnalyzer(input);
        this.semanticAnalyzer.analyzeFile();
        this.ast = this.semanticAnalyzer.getAst();
        this.complexTypeDeclarations = exportComplexTypeDeclarations();
        // TODO: Load reserved complex types
        this.declarations = [];
        this.functionDeclarations = exportFuncDeclarations();
    }

    public interpret(s: Statement, scope: InterpreterScope): any {
        if (s instanceof ComplexType) {
            this.declareComplexType(s);
        }

        if (s instanceof Func) {
            this.declareFunction(s);
        }

        if (s instanceof ReturnStatement) {
            return this.interpretReturn(s, scope);
        }

        if (s instanceof VarDeclaration) {
            this.declareVar(s, scope);
        }

        // TODO

        /*if (s instanceof IfStatement) {
            this.interpretIf()
        }*/

        /*if (s instanceof WhileStatement) {
            this.interpretWhile();
        }*/

        /*if (s instanceof PostDecrementStatement || s instanceof PostIncrementStatement) {
            this.checkPostOp(s, scope);
        }*/

        if (s instanceof AssignStatement) {
            this.interpretAssign(s, scope);
        }

        if (s instanceof ComplexAssignStatement) {
            this.interpretComplexAssign(s, scope);
        }

        /*if (s instanceof AccessAssignStatement) {
            this.checkAccessAssign(s, scope);
        }*/

        if (s instanceof FuncCallStatement) {
            this.interpretFuncCall(s, scope);
        }

    }

    public interpretFile() {
        for (const s of this.ast) {
            this.interpret(s, null);
        }
        console.dir(this.declarations);
    }

    public getVar(id: string, s: InterpreterScope) {
        // Traverse through scopes
        let currentScope = s;
        while(currentScope !== null) {
            const varDec = currentScope.declarations.find(d => d.getId() === id);
            if (varDec) {
                return varDec;
            }
            currentScope = currentScope.parentContext;
        }
        // In file context
        const varDec = this.declarations.find(d => d.getId() === id);

        return varDec;
    }

    public declareComplexType(s: ComplexType) {
        this.complexTypeDeclarations.push(s);
    }

    public declareFunction(s: Func) {
        this.functionDeclarations.push(s);
    }

    public declareVar(dec: VarDeclaration, scope: InterpreterScope) {
        if (scope) {
            // Variables can be local
            scope.declarations.push(dec);
        } else {
            // Global (file scope) var
            this.declarations.push(dec);
        }
    }

    public interpretReturn(s: ReturnStatement, sc: InterpreterScope) {
        return s.evaluateValue(sc);
    }

    public getFunc(id: string, s: InterpreterScope) {
        const func = this.functionDeclarations.find((f: Func) => f.getId() === id);
        return func;
    }

    public interpretFuncCall(s: FuncCallStatement, scope: InterpreterScope) {
        // Prepare params and call interpretFunc
        if (!scope) {
            scope = { interpreter: this, declarations: this.declarations };
        }
        const funcDec = this.getFunc(s.getFuncId().getValue(), scope);
        const callParams = s.getParams();
        const funcParams = funcDec.getParams();

        if (funcDec.getNativeFunc()) {
            const nativeFunc = funcDec.getNativeFunc();
            const evaluatedParams = callParams.map(p => p.evaluateValue(scope));
            const result = nativeFunc.apply(null, evaluatedParams);
            return result;
        }

        // Non-native func
        // Convert call params to var declarations
        const paramDeclarations = callParams.map((p, i) => {
            return new VarDeclaration(funcParams[i].getType(), funcParams[i].getId(), p.evaluateValue(scope));
        });
        return this.interpretFunc(funcDec, paramDeclarations, scope);
    }

    public interpretFunc(f: Func, params: VarDeclaration[], s: InterpreterScope) {
        // Setup scope and call interpreter
        const bodyScope = {
            declarations: [...params],
            returns: [],
            assigns: [],
            statements: [],
            retType: f.getReturnType(),
            interpreter: this,
            parentContext: s,
        }

        let returnValue = null;
        for (const st of f.getBody().getStatementsList()) {
            const val = this.interpret(st, bodyScope);
            if (val) {
                returnValue = val;
            }
        }

        return returnValue;
    }

    public interpretAssign(s: AssignStatement, scope: InterpreterScope) {
        const varId = s.getId().getValue();
        const varDec = this.getVar(varId, scope);
        let value = null;
        if (scope) {
            value = s.getValue().evaluateValue(scope);
        } else {
            value = s.getValue().evaluateValue({ interpreter: this, declarations: this.declarations });
        }
        varDec.setValue(value);
    }

    public interpretComplexAssign(s: ComplexAssignStatement, scope: InterpreterScope) {
        const varId = s.getId().getValue();
        const varDec = this.getVar(varId, scope);
        const objectValue = {};
        for (const a of s.getValues()) {
            let value = null;
            if (scope) {
                value = a.assignment.evaluateValue(scope);
            } else {
                value = a.assignment.evaluateValue({ interpreter: this, declarations: this.declarations });
            }
            objectValue[a.field] = value;
        }
        varDec.setValue(objectValue);
    }
}
