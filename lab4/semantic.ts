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
    context: any; // null - File
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

    public analyze(scope: Scope) {
        this.checkComplexTypes(scope);
    }

    public analyzeFile() {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = [];
        // TODO: Rewrite, process from first statement to last, don't jump by rule groups
        // ex. if current statement is complex type definition, check it with complex type definition rules
        this.analyze(null);
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

    public checkComplexTypes(scope: Scope) {
        let statements = [];
        if (scope) {
            statements = scope.statements;
        } else {
            statements = this.statements;
        }
        for (const s of statements) {
            if (s instanceof ComplexType) {
                const id = s.getId();
                const fields = s.getFields();
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
                this.complexTypeDeclarations.push(s);
            }
        }
    }

    public checkReturns(funcBody: Statement[], funcType: string) {
        let returnsCount = 0;
        for (const s of funcBody) {
            if (s instanceof ReturnStatement) {
                // TODO: Expression evaluation
                const retType = s.evaluateType().getType();
                returnsCount += 1;
                // SH08 Return type doesn't match with function's
                if (retType !== funcType) {
                    throw new Error(`SH08: Type ${retType} doesn't match with ${funcType}`);
                }
            }
        }

        // SH07: If not command, check if return is present
        if (funcType && returnsCount === 0) {
            throw new Error(`SH07: Missing return statement`);
        }
    }

    public checkFunctions(scope: Scope) {
        let statements = [];
        if (scope) {
            statements = scope.statements;
        } else {
            statements = this.statements;
        }
        for (const s of statements) {
            if (s instanceof Func) {
                const id = s.getId();
                const params = s.getParams();
                const body = s.getBody().getStatementsList();
                const retType = s.getReturnType();

                // SH06: Function already defined
                if (this.functionDeclarations.find(f => f.id === id)) {
                    throw new Error(`SH06: Function ${id} already declared`);
                }

                // SH02: Reserved identifier
                if (CharUtils.isIdentifierReserved(id)) {
                    throw new Error(`SH02: Reserved indentifier ${id}`);
                }

                // TODO: check statements inside body
                // TODO: check variable declarations before checking return type

                this.checkReturns(body, retType);
            }
        }
    }
}