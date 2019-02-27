export class VarDeclaration {
    private type: string;
    private identifier: string;
    constructor(type: string, identifier: string) {
        this.type = type;
        this.identifier = identifier;
    }

    public getType(): string {
        return this.type;
    }

    public getId(): string {
        return this.identifier;
    }
}
