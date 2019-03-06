export namespace TokenTypes {
    export const RuneLiteral = 'runeLiteral';
    export const StringLiteral = 'stringLiteral';
    export const IntegerLiteral = 'integerLiteral';
    export const BooleanLiteral = 'booleanLiteral';
    export const Identifier = 'identifier';
    export const EOF = 'eof';
    export const Unknown = 'unknown';

    export const Pipe = '|';
    export const Amp = '&';
    export const Not = '!';
    export const And = '&&';
    export const Or = '||';
    export const Eq = '==';
    export const Neq = '!=';
    export const Lt = '<';
    export const Rt = '>';
    export const LtEq = '<=';
    export const RtEq = '>=';
    export const Plus = '+';
    export const Minus = '-';
    export const Times = '*';
    export const Div = '/';
    export const PostIncrement = '++';
    export const PostDecrement = '--';
    
    // Reserved
    export const Integer = 'integer';
    export const Rune = 'rune';
    export const String = 'string';
    export const Boolean = 'boolean';
    export const User = 'user';
    export const Repo = 'repo';
    export const CiConfig = 'ciConfig';
    export const Deployment = 'deployment';
    export const Manifest = 'manifest';
    export const If = 'if';
    export const Else = 'else';
    export const While = 'while';
    export const Void = 'void';
    export const Var = 'var';
    export const Command = 'command';
    export const Func = 'func';
    export const Complex = 'complex';
    export const Return = 'return';

    export const Lparent = '(';
    export const Rparent = ')';
    export const Lbrace = '{';
    export const Rbrace = '}';
    export const Semi = ';';
    export const Comma = ',';
    export const Assign = '=';
    export const Dot = '.';
}

export class Token {
    private type: string;
    private value: string;
    private line: number;
    private column: number;

    constructor(type: string, value: string, line: number, column: number) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    public getType(): string {
        return this.type;
    }

    public getLine(): number {
        return this.line;
    }

    public getValue(): string {
        return this.value;
    }

    public getColumn(): number {
        return this.column;
    }

}