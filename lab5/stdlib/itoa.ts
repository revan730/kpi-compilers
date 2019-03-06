import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const itoaNative = (i: number): string => String(i);
export const ItoaDec = new Func("itoa",
 [new FunctionParameter("integer", "i")], new BlockStatement([]), "string", itoaNative);
