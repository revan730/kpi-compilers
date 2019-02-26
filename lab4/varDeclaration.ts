export class VarDeclaration {
    private type: string;
    private identifier: string;
    constructor(type: string, identifier: string) {
        this.type = type;
        this.identifier = identifier;
    }
}