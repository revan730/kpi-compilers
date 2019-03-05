import { Scope } from "../semantic";
import { Expression } from "./expression";

export class FuncCallExpression implements Expression {
    private id: string;
    private params: Expression[];
    constructor(id: string, params: Expression[]) {
        this.id = id;
        this.params = params;
    }

    public getId = () => {
        return this.id;
    }

    public getParams = () => {
        return this.params;
    }

    public evaluateType(s: Scope): string {
        // Expression type is function's return type
        // TODO: Check parameter count and types
        return s.analyzer.findFunctionDeclaration(this.id, s).getReturnType();
    }

    public getIdentifiers(): string[] {
        return [this.id];
    }
}
