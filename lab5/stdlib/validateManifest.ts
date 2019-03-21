import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const validateManifestNative = (m: any): boolean => {
    //const expression = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const expression = /(?:.+\/)?([^:]+)(?::.+)?/;
    const validImageTag = !!m.image.match(expression);
    const validReplicaCount = m.replicas > 0;
    return validImageTag && validReplicaCount;
}

export const ValidateManifestDec = new Func("validateManifest",
 [new FunctionParameter("manifest", "m")], new BlockStatement([]), "boolean", validateManifestNative);
