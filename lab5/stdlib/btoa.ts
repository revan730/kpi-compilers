import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const btoaNative = (i: boolean): string => String(i);
export const BtoaDec = new Func("btoa",
 [new FunctionParameter("boolean", "b")], new BlockStatement([]), "string", btoaNative);
