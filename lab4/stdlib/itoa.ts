import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

export const ItoaDec = new Func("itoa", [new FunctionParameter("integer", "i")], new BlockStatement([]), "string");
export const ItoaNative = (i: number): string => String(i);
