import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const validateUrlNative = (url: string): boolean => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return !!url.match(expression);
};

export const ValidateUrlDec = new Func("validateUrl",
 [new FunctionParameter("string", "url")], new BlockStatement([]), "boolean", validateUrlNative);
