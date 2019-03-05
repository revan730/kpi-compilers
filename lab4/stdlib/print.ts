import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

export const PrintDec = new Func("print", [new FunctionParameter("string", "msg")], new BlockStatement([]), null);
export const PrintNative = (msg: string) => console.log(msg);
