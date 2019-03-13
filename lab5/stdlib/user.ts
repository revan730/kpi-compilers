import { ComplexType } from "../ast/complexType";
import { ComplexField } from "../ast/complexField";

export const UserDec = new ComplexType("user", [
    new ComplexField("string", "username"),
    new ComplexField("string", "hookSecret"),
    new ComplexField("string", "accessToken"),
]);
