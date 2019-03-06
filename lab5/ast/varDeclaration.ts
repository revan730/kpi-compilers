export class VarDeclaration {
    private type: string;
    private identifier: string;
    private value: any;
    constructor(type: string, identifier: string, value?: any) {
        this.type = type;
        this.identifier = identifier;
        this.value = value;
    }

    public getType(): string {
        return this.type;
    }

    public getId(): string {
        return this.identifier;
    }

    public getValue(): any {
        return this.value;
    }

    public setValue(v: any) {
        this.value = v;
    }
}
