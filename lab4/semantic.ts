import { ComplexField } from "./ast/complexField";
import { ComplexType } from "./ast/complexType";
import { Func } from "./ast/func";
import { ReturnStatement } from "./ast/returnStatement";
import { Statement } from "./ast/statement";
import * as CharUtils from "./charUtils";
import { Parser } from "./parser";
import { FunctionParameter } from "./ast/functionParameter";
import { IdentifierExpression } from "./ast/identifierExpression";
import { VarDeclaration } from "./ast/varDeclaration";
import { IfStatement } from "./ast/ifStatement";
import { TokenTypes } from "./token";

export interface Scope {
    statements: Statement[];
    assigns: any;
    // TODO: Parent context
    returns: any;
    declarations: any;
    parentContext: any;
    retType: any; // If in function scope
    analyzer: SemanticAnalyzer;
}

export class SemanticAnalyzer {
    private statements: Statement[];
    private complexTypeDeclarations: any;
    private functionDeclarations: any;
    private declarations: any;
    private assigns: any;
    private conditions: any;
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

    }

    public analyzeFile() {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = [];
        this.functionDeclarations = [];
        this.assigns = [];
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
            const varDec = s.declarations.find(d => d.getId() === id);
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
            throw new Error(`SH??: Complex type '${complex.getId()}' not declared`);
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
        const condType = st.getCondExp().evaluateType(sc);
        if (condType !== TokenTypes.Boolean) {
            throw new Error(`SH11: If statement's condition type is ${condType} but boolean expected`);
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
            returns: [],
            assigns: [],
            statements: [],
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
