import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const validateManifestNative = (m: any): boolean => {
    const expression = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return !!m.image.match(expression);
}

export const ValidateManifestDec = new Func("validateManifest",
 [new FunctionParameter("manifest", "m")], new BlockStatement([]), "boolean", validateManifestNative);
