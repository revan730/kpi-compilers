import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const strConcatNative = (s1: string, s2: string): string => s1 + s2;
export const StrConcatDec = new Func("strConcat",
 [new FunctionParameter("string", "s1"), new FunctionParameter("string", "s2")],
  new BlockStatement([]), "string", strConcatNative);