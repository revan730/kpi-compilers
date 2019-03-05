import { AssignStatement } from "../ast/assignStatement";
import { BlockStatement } from "../ast/block";
import { FieldAccessExpression } from "../ast/fieldAccessExpression";
import { Func } from "../ast/func";
import { FuncCallExpression } from "../ast/funcCallExpression";
import { FunctionParameter } from "../ast/functionParameter";
import { Identifier } from "../ast/identifier";
import { IdentifierExpression } from "../ast/identifierExpression";
import { ReturnStatement } from "../ast/returnStatement";
import { VarDeclaration } from "../ast/varDeclaration";

const statements = [
    new VarDeclaration("boolean", "urlValid"),
    new AssignStatement(new Identifier("urlValid"), new FuncCallExpression("validateUrl",
    [ new FieldAccessExpression(new IdentifierExpression("r"), new IdentifierExpression("url")) ])),
    new ReturnStatement(new IdentifierExpression("urlValid")),
];

export const ValidateRepoDec = new Func("validateRepo",
 [new FunctionParameter("repo", "r")], new BlockStatement(statements), "boolean");
