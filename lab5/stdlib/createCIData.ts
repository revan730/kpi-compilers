import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const createCIDataNative = (r: any,  config: any): string => {
    const gitUrl = r.url.split("https://")[1];
    const fullUrl = `https://${r.owner.username}:${r.owner.accessToken}@${gitUrl}`;
    const gcrRepo = `${config.gcr}/${r.fullName}`;
    return `fullUrl '${fullUrl}'\nbranch '${r.branch}'\ngcrRepo '${gcrRepo}'\n`;
};

export const CreateCIDataDec = new Func("createCIData",
 [new FunctionParameter("repo", "r"), new FunctionParameter("ciConfig", "config")], new BlockStatement([]), "string", createCIDataNative);