import { Statement } from "./statement";
import { Parser } from "./parser";
import { ComplexType } from "./complexType";
import * as CharUtils from "./charUtils";
import { ComplexField } from "./complexField";

export class SemanticAnalyzer {
    private statements: Statement[];
    private complexTypeDeclarations: any;
    private assigns: any;
    private conditions: any;
    private parser: Parser;

    constructor(input: string){
        this.parser = new Parser(input);
    }

    public analyze() {
        this.statements = this.parser.parseProgram();
        this.complexTypeDeclarations = [];
        this.checkComplexTypes();
    }

    public checkComplexTypeFields(complexID: string, fields: ComplexField[]) {
        const identifiers = [];
        for (const s of fields) {
            const fieldType = s.getType();
            const id = s.getId();
            // SH04: Unknown type
            if (!CharUtils.isIdentifierReserved(fieldType) && !this.complexTypeDeclarations.find(ct => ct.id === fieldType)) {
                throw new Error(`SH04: Unknown type ${fieldType}`);
            }
            if (identifiers.indexOf(id) > -1) {
                throw new Error(`SH05: Field with id ${id} already declared for ${complexID}`);
            }
            identifiers.push(id);
        }
    }

    public checkComplexTypes() {
        for (const s of this.statements) {
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
}