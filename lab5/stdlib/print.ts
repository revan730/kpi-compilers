import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const printNative = (msg: string) => console.log(msg);
export const PrintDec = new Func("print",
 [new FunctionParameter("string", "msg")], new BlockStatement([]), null, printNative);
