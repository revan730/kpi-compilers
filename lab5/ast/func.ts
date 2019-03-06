import { BlockStatement } from "./block";
import { FunctionParameter } from "./functionParameter";

export class Func {
    private id: string;
    private params: FunctionParameter[];
    private body: BlockStatement;
    private returnType: string | null;
    private native: any;

    constructor(id: string, params: FunctionParameter[], body: BlockStatement, ret: string | null, native?: any) {
        this.id = id;
        this.params = params;
        this.body = body;
        this.returnType = ret;
        this.native = native; // JS\TS function, will be called instead of body block
        // evaluation if defined.
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

    public getNativeFunc(): any {
        return this.native;
    }
}
