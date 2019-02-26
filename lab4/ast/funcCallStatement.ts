import { Statement } from "./statement";
import { Expression } from "./expression";
import { Identifier } from "./identifier";

export class FuncCallStatement implements Statement {
    private funcId: Identifier;
    private params: Expression[];

    constructor(funcId: Identifier, params: Expression[]) {
        this.funcId = funcId;
        this.params = params;
    }

    public getFuncId(): Identifier {
		return this.funcId;
	}
	
	public getParams(): Expression[] {
		return this.params;
	}
}