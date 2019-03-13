import { ComplexType } from "../ast/complexType";
import { ComplexField } from "../ast/complexField";

export const CIConfigDec = new ComplexType("ciConfig", [
    new ComplexField("string", "gcr"),
]);