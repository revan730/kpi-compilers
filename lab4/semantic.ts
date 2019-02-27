import { Statement } from "./ast/statement";
import { Parser } from "./parser";
import { ComplexType } from "./ast/complexType";
import * as CharUtils from "./charUtils";
import { ComplexField } from "./ast/complexField";
import { Func } from "./ast/func";
import { ReturnStatement } from "./ast/returnStatement";

interface Scope {
    statements: Statement[];
    assigns: any;
    // TODO: Parent context
    returns: any;
    declarations: any;
    parentContext: any;
    retType: any; // If in function scope
}

export class SemanticAnalyzer {
    private statements: Statement[];
    private complexTypeDeclarations: any;
    private functionDeclarations: any;
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
    }

    public analyzeFile() {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = [];
        this.functionDeclarations = [];
        this.assigns = [];
        for (const s of this.statements) {
            this.analyze(s, null);
        }
    }

    public checkComplexTypeFields(complexID: string, fields: ComplexField[]) {
        const identifiers = [];
        for (const s of fields) {
            const fieldType = s.getType();
            const id = s.getId();
            // SH04: Unknown type
            const isReserved = !CharUtils.isIdentifierReserved(fieldType);
            if (isReserved && !this.complexTypeDeclarations.find(ct => ct.id === fieldType)) {
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
        if (this.complexTypeDeclarations.find(ct => ct.id === id)) {
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
        // TODO: Expression evaluation
        const retType = r.evaluateType(scope).getType();
        // SH08 Return type doesn't match with function's
        if (retType !== funcType) {
            throw new Error(`SH08: Type ${retType} doesn't match with ${funcType}`);
        }

    }

    public checkFunction(f: Func, scope: Scope) {
        const id = f.getId();
        const params = f.getParams();
        const body = f.getBody().getStatementsList();
        const retType = f.getReturnType();

        // SH06: Function already defined
        if (this.functionDeclarations.find(f => f.id === id)) {
            throw new Error(`SH06: Function ${id} already declared`);
        }

        // SH02: Reserved identifier
        if (CharUtils.isIdentifierReserved(id)) {
            throw new Error(`SH02: Reserved indentifier ${id}`);
        }

        // Descend into function body
        const bodyScope = {
            declarations: [],
            returns: [],
            assigns: [],
            parentContext: null,
        };

        for (const s of body) {
            this.analyze(s, scope);
        }

        // TODO: check statements inside body
        // TODO: check variable declarations before checking return type

        // SH07: If not command, check if return is present
        /*if (funcType && returnsCount === 0) {
            throw new Error(`SH07: Missing return statement`);
        }*/
    }
}