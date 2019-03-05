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

        const funcDec = s.analyzer.findFunctionDeclaration(this.id, s);
        const funcParams = funcDec.getParams();
        const callParams = this.getParams();

        if (!funcDec) {
            throw new Error(`SH19: Trying to call func ${this.id} but it's not declared`);
        }
        // Check if parameter count match
        if (funcParams.length !== callParams.length) {
            throw new Error(`SH20: Func ${this.id} has ${funcParams.length} params, called with ${callParams.length}`);
        }
        // Check if parameter types match
        for (let i = 0; i < funcParams.length; i++) {
            const expectedType = funcParams[i].getType();
            const actualType = callParams[i].evaluateType(s);
            if (expectedType !== actualType) {
                throw new Error(`SH21: Param at index ${i + 1} expected to have type ${expectedType}, got ${actualType}`);
            }
        }


        return s.analyzer.findFunctionDeclaration(this.id, s).getReturnType();
    }

    public getIdentifiers(): string[] {
        return [this.id];
    }
}
