import { Func } from "../ast/func";
import { ItoaDec } from "./itoa";
import { PrintDec } from "./print";
import { ValidateRepoDec } from "./validateRepo";
import { ValidateUrlDec } from "./validateUrl";

export function exportFuncDeclarations(): Func[] {
    return [PrintDec, ItoaDec, ValidateRepoDec, ValidateUrlDec];
}
