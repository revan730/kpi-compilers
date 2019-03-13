import { AccessAssignStatement } from "./ast/accessAssignStatement";
import { AssignStatement } from "./ast/assignStatement";
import { ComplexField } from "./ast/complexField";
import { ComplexType } from "./ast/complexType";
import { Func } from "./ast/func";
import { FuncCallStatement } from "./ast/funcCallStatement";
import { FunctionParameter } from "./ast/functionParameter";
import { IfStatement } from "./ast/ifStatement";
import { PostDecrementStatement } from "./ast/postDecrement";
import { PostIncrementStatement } from "./ast/postIncrement";
import { ReturnStatement } from "./ast/returnStatement";
import { Statement } from "./ast/statement";
import { VarDeclaration } from "./ast/varDeclaration";
import { WhileStatement } from "./ast/whileStatement";
import * as CharUtils from "./charUtils";
import { Parser } from "./parser";
import { exportFuncDeclarations, exportComplexTypeDeclarations } from "./stdlib";
import { TokenTypes } from "./token";
import { ComplexAssignStatement } from "./ast/ComplexAssignStatement";

export interface Scope {
    declarations?: any;
    parentContext?: any;
    retType?: any; // If in function scope
    analyzer: SemanticAnalyzer;
}

export class SemanticAnalyzer {
    private statements: Statement[];
    private complexTypeDeclarations: any;
    private functionDeclarations: any;
    private declarations: any;
    private parser: Parser;

    constructor(input: string){
        this.parser = new Parser(input);
    }

    public analyze(s: Statement, scope: Scope) {

        if (s instanceof ComplexType) {
            this.checkComplexType(s, scope);
        }

        if (s instanceof Func) {
            this.checkFunction(s, scope);
        }

        if (s instanceof ReturnStatement) {
            this.checkReturn(s, scope, scope.retType);
        }

        if (s instanceof VarDeclaration) {
            this.checkVariableDeclaration(s, scope);
        }

        if (s instanceof IfStatement) {
            this.checkIf(s, scope);
        }

        if (s instanceof WhileStatement) {
            this.checkWhile(s, scope);
        }

        if (s instanceof PostDecrementStatement || s instanceof PostIncrementStatement) {
            this.checkPostOp(s, scope);
        }

        if (s instanceof AssignStatement) {
            this.checkAssign(s, scope);
        }

        if (s instanceof ComplexAssignStatement) {
            this.checkComplexAssign(s, scope);
        }

        if (s instanceof AccessAssignStatement) {
            this.checkAccessAssign(s, scope);
        }

        if (s instanceof FuncCallStatement) {
            this.checkFuncCall(s, scope);
        }

    }

    public getAst(): Statement[] {
        return this.statements;
    }

    public analyzeFile() {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = exportComplexTypeDeclarations();
        this.functionDeclarations = exportFuncDeclarations();
        this.declarations = [];
        for (const s of this.statements) {
            this.analyze(s, null);
        }
    }

    public findFunctionDeclaration(id: string, s: Scope) {
        // Functions are global, so no need to traverse local scopes
        const func = this.functionDeclarations.find((f: Func) => f.getId() === id);
        if (!func) {
            throw new Error(`SH??: Function with id ${id} not declared`);
        }
        return func;
    }

    public findVariableDeclaration(id: string, s: Scope) {
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

    public findComplexFieldDeclaration(complexTypeId: string, fieldId: string, s: Scope) {
        // Find VARIABLE with compexTypeId, check if it's complex, then check it's field type
        const complex = this.findVariableDeclaration(complexTypeId, s);
        if (!complex) {
            throw new Error(`SH??: Complex type variable with id '${complexTypeId}' not found`);
        }
        const complexType = this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === complex.getType());
        if (!complexType) {
            throw new Error(`SH??: Complex type '${complex.getType()}' not declared`);
        }
        const field = complexType.getFields().find((f: ComplexField) => f.getId() === fieldId);
        if (!field) {
            throw new Error(`SH??: Complex type '${complexTypeId}' has no field ${fieldId}`);
        }
        return field;
    }

    public checkComplexTypeFields(complexID: string, fields: ComplexField[]) {
        const identifiers = [];
        for (const s of fields) {
            const fieldType = s.getType();
            const id = s.getId();
            // SH04: Unknown type
            const isReserved = !CharUtils.isIdentifierReserved(fieldType);
            if (isReserved && !this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === fieldType)) {
                throw new Error(`SH04: Unknown type ${fieldType}`);
            }
            if (identifiers.indexOf(id) > -1) {
                throw new Error(`SH05: Field with id ${id} already declared for ${complexID}`);
            }
            identifiers.push(id);
        }
    }

    public checkComplexType(c: ComplexType, scope: Scope) {
        const id = c.getId();
        const fields = c.getFields();
        // SH01: Complex type already defined
        if (this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === id)) {
            throw new Error(`SH01: Complex type ${id} already declared`);
        }
        // SH02: Reserved identifier
        if (CharUtils.isIdentifierReserved(id)) {
            throw new Error(`SH02: Reserved indentifier ${id}`);
        }
        // SH03: Empty complex type declaration
        if (fields.length === 0) {
             throw new Error(`SH03: Empty complex type ${id} declaration`);
        }

        this.checkComplexTypeFields(id, fields);
        this.complexTypeDeclarations.push(c);
    }

    public checkComplexAssign(s: ComplexAssignStatement, scope: Scope) {
        if (!scope) {
            scope = { analyzer: this, declarations: this.declarations };
        }
        const id = s.getId().getValue();
        const fieldAssignments = s.getValues();
        for (const a of fieldAssignments) {
            const fieldDec = this.findComplexFieldDeclaration(id, a.field, scope);
            const assignType = a.assignment.evaluateType(scope);
            const fieldType = fieldDec.getType();
            if (fieldType !== a.assignment.evaluateType(scope)) {
                throw new Error(`SH18: Trying to assign ${assignType} to ${fieldType} field ${a.field} of ${id} var`);
            }
        }
    }

    public checkReturn(r: ReturnStatement, scope: Scope, funcType: string) {
        const retType = r.evaluateType(scope);

        // SH08 Return type doesn't match with function's
        if (retType !== funcType) {
            throw new Error(`SH08: Type ${retType} doesn't match with ${funcType} `);
        }

    }

    public checkVariableDeclaration(dec: VarDeclaration, scope: Scope) {
        const id = dec.getId();
        const type = dec.getType();
        if (this.findVariableDeclaration(id, scope)) {
            throw new Error(`SH10: Variable with id ${id} already declared`);
        }

        const isReserved = !CharUtils.isIdentifierReserved(type);
        if (isReserved && !this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === type)) {
            throw new Error(`SH04: Unknown type ${type}`);
        }
        if (scope) {
            // Variables can be local
            scope.declarations.push(dec);
        } else {
            // Global (file scope) var
            this.declarations.push(dec);
        }
    }

    public checkIf(st: IfStatement, sc: Scope) {
        if (!sc) {
            sc = { analyzer: this, declarations: this.declarations };
        }
        const condType = st.getCondExp().evaluateType(sc);
        const trueBody = st.getTrueStmArr();
        if (condType !== TokenTypes.Boolean) {
            throw new Error(`SH11: If statement's condition type is ${condType} but boolean expected`);
        }

        // Descend into true branch body
        const trueScope = {
            declarations: [],
            retType: sc.retType,
            analyzer: this,
            parentContext: sc,
        };

        for (const s of trueBody) {
            this.analyze(s, trueScope);
        }

        // Descend into false branch body

        if (st.hasFalseBlock()) {
            const falseBody = st.getFalseStmArr();
            const falseScope = {
                declarations: [],
                retType: sc.retType,
                analyzer: this,
                parentContext: sc,
            };

            for (const s of falseBody) {
                this.analyze(s, falseScope);
            }
        }
    }

    public checkPostOp(st: PostIncrementStatement | PostDecrementStatement, sc: Scope) {
        const varId = st.getId().getValue();
        const varDec = this.findVariableDeclaration(varId, sc);
        if (!varDec) {
            throw new Error(`SH13: Var ${varId} not found`);
        }
        if (varDec.getType() !== TokenTypes.Integer) {
            throw new Error(`SH14: Post op called for ${varDec.getType()} but integer expected`);
        }
    }

    public checkAssign(st: AssignStatement, sc: Scope) {
        if (!sc) {
            sc = { analyzer: this, declarations: this.declarations };
        }
        const varId = st.getId().getValue();
        const varDec = this.findVariableDeclaration(varId, sc);
        let assignType = null;
        if (sc) {
            assignType = st.getValue().evaluateType(sc);
        } else {
            assignType = st.getValue().evaluateType({ analyzer: this});
        }

        if (!varDec) {
            throw new Error(`SH15: Trying to assign ${varId} but it's not declared`);
        }
        if (varDec.getType() !== assignType) {
            throw new Error(`SH16: Trying to assign ${assignType} to ${varDec.getType()} variable`);
        }
    }

    public checkAccessAssign(st: AccessAssignStatement, sc: Scope) {
        const varId = st.getComplexId();
        const varDec = this.findVariableDeclaration(varId, sc);
        const assignType = st.getValue().evaluateType(sc);
        const fieldId = st.getFieldId();

        if (!varDec) {
            throw new Error(`SH17: Trying to assign complex var ${varId} but it's not declared`);
        }

        const fieldType = this.findComplexFieldDeclaration(varId, fieldId, sc).getType();

        if (fieldType !== assignType) {
            throw new Error(`SH18: Trying to assign ${assignType} to ${fieldType} field ${fieldId} of ${varId} var`);
        }
    }

    public checkFuncCall(st: FuncCallStatement, sc: Scope) {
        const funcId = st.getFuncId().getValue();
        const funcDec = this.findFunctionDeclaration(funcId, sc);
        const funcParams = funcDec.getParams();
        const callParams = st.getParams();
        if (!sc) {
            sc = { analyzer: this, declarations: this.declarations };
        }

        if (!funcDec) {
            throw new Error(`SH19: Trying to call func ${funcId} but it's not declared`);
        }
        // Check if parameter count match
        if (funcParams.length !== callParams.length) {
            throw new Error(`SH20: Func ${funcId} has ${funcParams.length} params, called with ${callParams.length}`);
        }
        // Check if parameter types match
        for (let i = 0; i < funcParams.length; i++) {
            const expectedType = funcParams[i].getType();
            let actualType = null;
            actualType = callParams[i].evaluateType(sc);
            if (expectedType !== actualType) {
                throw new Error(`SH21: Param at index ${i + 1} expected to have type ${expectedType}, got ${actualType}`);
            }
        }
    }

    public checkWhile(st: WhileStatement, sc: Scope) {
        if (!sc) {
            sc = { analyzer: this, declarations: this.declarations };
        }
        const condType = st.getCondExp().evaluateType(sc);
        const body = st.getLoopStm();
        if (condType !== TokenTypes.Boolean) {
            throw new Error(`SH12: While statement's condition type is ${condType} but boolean expected`);
        }

        // Check if it will not loop forever
        const expressionIdentifiers = st.getCondExp().getIdentifiers();
        let atLeastOneIdUsed = false;
        for (const s of st.getLoopStm()) {
            if (s instanceof AssignStatement
                || s instanceof PostDecrementStatement || s instanceof PostIncrementStatement) {
                if (expressionIdentifiers.find(e => e === s.getId().getValue())) {
                    atLeastOneIdUsed = true;
                }
            }
        }
        if (!atLeastOneIdUsed) {
            throw new Error(`SH13: Possible endless while loop`);
        }

        // Descend into body
        const bodyScope = {
            declarations: [],
            retType: sc.retType,
            analyzer: this,
            parentContext: sc,
        };

        for (const s of body) {
            this.analyze(s, bodyScope);
        }
    }

    public checkFunctionParameters(funcID: string, params: FunctionParameter[]) {
        const identifiers = [];
        for (const s of params) {
            const paramType = s.getType();
            const id = s.getId();
            // SH04: Unknown type
            const isReserved = !CharUtils.isIdentifierReserved(paramType);
            if (isReserved && !this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === paramType)) {
                throw new Error(`SH04: Unknown type ${paramType}`);
            }
            if (identifiers.indexOf(id) > -1) {
                throw new Error(`SH09: Param with id ${id} already declared for ${funcID}`);
            }
            identifiers.push(id);
        }
    }

    public checkFunction(f: Func, scope: Scope) {
        const id = f.getId();
        const params = f.getParams();
        const body = f.getBody().getStatementsList();
        const retType = f.getReturnType();

        // SH06: Function already defined
        if (this.functionDeclarations.find((f: Func) => f.getId() === id)) {
            throw new Error(`SH06: Function ${id} already declared`);
        }

        // SH02: Reserved identifier
        if (CharUtils.isIdentifierReserved(id)) {
            throw new Error(`SH02: Reserved indentifier ${id}`);
        }

        // SH04: Unknown type
        if (retType) {
            const isReserved = !CharUtils.isIdentifierReserved(retType);
            if (isReserved && !this.complexTypeDeclarations.find((ct: ComplexType) => ct.getId() === retType)) {
                throw new Error(`SH04: Unknown type ${retType}`);
            }
        }

        this.checkFunctionParameters(id, params);

        // Descend into function body
        const bodyScope = {
            declarations: [...params],
            retType,
            analyzer: this,
            parentContext: null,
        };

        for (const s of body) {
            this.analyze(s, bodyScope);
        }

        this.functionDeclarations.push(f);
    }
}
