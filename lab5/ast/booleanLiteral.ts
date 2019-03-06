import { Expression } from "./expression";
import { TokenTypes } from "../token";
import { InterpreterScope } from "../interpreterScope";

export class BooleanLiteral implements Expression {
    private value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    public getValue = () => {
        return this.value;
    }

    public evaluateType(): string {
        return TokenTypes.Boolean;
    }

    public evaluateValue(s: InterpreterScope): any {
        return this.getValue();
    }

    public getIdentifiers(): string[] {
        return [];
    }
}
