import { FunctionParameter } from "./functionParameter";
import { BlockStatement } from "./block";

export class Func {
    private id: string;
    private params: FunctionParameter[];
    private body: BlockStatement;
    private returnType: string | null;

    constructor(id: string, params: FunctionParameter[], body: BlockStatement, ret: string | null) {
        this.id = id;
        this.params = params;
        this.body = body;
        this.returnType = ret;
    }

    public getId(): string {
        return this.id;
    }

    public getParams(): FunctionParameter[] {
        return this.params;
    }

    public getBody(): BlockStatement {
        return this.body;
    }

    public getReturnType(): string {
        return this.returnType;
    }
}