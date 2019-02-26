import { Expression } from "./expression";

export class FuncCallExpression implements Expression {
    private id: string;
    private params: Expression[];
    constructor(id: string, params: Expression[]) {
        this.id = id;
        this.params = params;
    }
    getId = () => {
        return this.id;
    };
    getParams = () => {
        return this.params;
    };
}