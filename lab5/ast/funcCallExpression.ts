import { Scope } from "../semantic";
import { Expression } from "./expression";
import { InterpreterScope } from "../interpreterScope";
import { VarDeclaration } from "./varDeclaration";

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

    public evaluateValue(s: InterpreterScope): any {
        const funcDec = s.interpreter.getFunc(this.id, s);
        const funcParams = funcDec.getParams();
        const callParams = this.getParams();

        if (funcDec.getNativeFunc()) {
            const nativeFunc = funcDec.getNativeFunc();
            const evaluatedParams = callParams.map(p => p.evaluateValue(s));
            const result = nativeFunc.apply(null, evaluatedParams);
            return result;
        }

        // Non-native func
        // Convert call params to var declarations
        const paramDeclarations = callParams.map((p, i) => {
            return new VarDeclaration(funcParams[i].getType(), funcParams[i].getId(), p.evaluateValue(s));
        });
        return s.interpreter.interpretFunc(funcDec, paramDeclarations, s);
    }

    public getIdentifiers(): string[] {
        return [this.id];
    }
}
