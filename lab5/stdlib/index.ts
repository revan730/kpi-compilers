import { Func } from "../ast/func";
import { ItoaDec } from "./itoa";
import { PrintDec } from "./print";
import { ValidateRepoDec } from "./validateRepo";
import { ValidateUrlDec } from "./validateUrl";
import { ComplexType } from "../ast/complexType";
import { UserDec } from "./user";
import { RepoDec } from "./repo";
import { BtoaDec } from "./btoa";
import { StrConcatDec } from "./strConcat";

export function exportFuncDeclarations(): Func[] {
    return [PrintDec, ItoaDec, ValidateRepoDec, ValidateUrlDec, BtoaDec, StrConcatDec];
}

export function exportComplexTypeDeclarations(): ComplexType[] {
    return [UserDec, RepoDec];
}