import { ComplexType } from "../ast/complexType";
import { ComplexField } from "../ast/complexField";

export const RepoDec = new ComplexType("repo", [
    new ComplexField("string", "fullName"),
    new ComplexField("user", "owner"),
    new ComplexField("string", "url"),
    new ComplexField("string", "branch"),
]);
