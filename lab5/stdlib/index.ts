import { Func } from "../ast/func";
import { ItoaDec } from "./itoa";
import { PrintDec } from "./print";
import { ValidateRepoDec } from "./validateRepo";
import { ValidateUrlDec } from "./validateUrl";
import { ComplexType } from "../ast/complexType";
import { UserDec } from "./user";

export function exportFuncDeclarations(): Func[] {
    return [PrintDec, ItoaDec, ValidateRepoDec, ValidateUrlDec];
}

export function exportComplexTypeDeclarations(): ComplexType[] {
    return [UserDec];
}