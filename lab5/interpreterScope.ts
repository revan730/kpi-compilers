import { Statement } from "./ast/statement";
import { Interpreter } from "./interpreter";

export interface InterpreterScope {
    statements?: Statement[];
    assigns?: any;
    returns?: any;
    declarations?: any;
    parentContext?: any;
    retType?: any; // If in function scope
    interpreter: Interpreter;
}