import { TokenTypes, Token } from "./token";
import * as CharUtils from "./charUtils";
import { Lexer } from "./lexer";
import { VarDeclaration } from "./ast/varDeclaration";
import { IntegerLiteral } from "./ast/integerLiteral";
import { BooleanLiteral } from "./ast/booleanLiteral";
import { IdentifierExpression } from "./ast/identifierExpression";
import { StringLiteral } from "./ast/stringLiteral";
import { RuneLiteral } from "./ast/runeLiteral";
import { Expression } from "./ast/expression";
import { NotExpression } from "./ast/notExpression";
import { NegativeExpression } from "./ast/negativeExpression";
import { AndExpression } from "./ast/AndExpression";
import { OrExpression } from "./ast/OrExpression";
import { EqualExpression } from "./ast/EqualExpression";
import { NotEqualExpression } from "./ast/notEqualExpression";
import { LessThanExpression } from "./ast/lessThanExpression";
import { GreaterThanExpression } from "./ast/greaterThanExpression";
import { LessThanEqualExpression } from "./ast/lessThanEqualExpression";
import { GreaterThanEqualExpression } from "./ast/greaterThanEqualExpression";
import { PlusExpression } from "./ast/plusExpression";
import { MinusExpression } from "./ast/minusExpression";
import { TimesExpression } from "./ast/timesExpression";
import { DivExpression } from "./ast/divExpression";
import { IfStatement } from "./ast/ifStatement";
import { Identifier } from "./ast/identifier";
import { AssignStatement } from "./ast/assignStatement";
import { Statement } from "./ast/statement";
import { BlockStatement } from "./ast/block";
import { ComplexField } from "./ast/complexField";
import { ComplexType } from "./ast/complexType";
import { FunctionParameter } from "./ast/functionParameter";
import { Func } from "./ast/func";
import { ReturnStatement } from "./ast/returnStatement";
import {
  FieldAssignment,
  ComplexAssignStatement
} from "./ast/ComplexAssignStatement";
import { PostIncrementStatement } from "./ast/postIncrement";
import { PostDecrementStatement } from "./ast/postDecrement";
import { FieldAccessExpression } from "./ast/fieldAccessExpression";
import { AccessAssignStatement } from "./ast/accessAssignStatement";
import { WhileStatement } from "./ast/whileStatement";
import { FuncCallStatement } from "./ast/funcCallStatement";
import { FuncCallExpression } from "./ast/funcCallExpression";

export class Parser {
  private binopLevels: any;
  private identifiers: any;
  private statements: any;
  private complexTypes: any;
  private functions: any;
  private lexer: Lexer;
  private tokens: Token[];
  private errorToken: Token;
  private currentToken: number;
  private token: Token;
  private errors: number;

  private initBinopLevels() {
    this.binopLevels = {};
    this.binopLevels[TokenTypes.And] = 10;
    this.binopLevels[TokenTypes.Or] = 10;
    this.binopLevels[TokenTypes.Lt] = 20;
    this.binopLevels[TokenTypes.Rt] = 20;
    this.binopLevels[TokenTypes.LtEq] = 20;
    this.binopLevels[TokenTypes.RtEq] = 20;
    this.binopLevels[TokenTypes.Eq] = 20;
    this.binopLevels[TokenTypes.Neq] = 20;
    this.binopLevels[TokenTypes.Plus] = 30;
    this.binopLevels[TokenTypes.Minus] = 30;
    this.binopLevels[TokenTypes.Times] = 40;
    this.binopLevels[TokenTypes.Div] = 40;
    this.binopLevels[TokenTypes.Dot] = 45;
    this.binopLevels[TokenTypes.Lbrace] = 50;
  }
  constructor(input: string) {
    this.initBinopLevels();
    this.lexer = new Lexer(input);
    this.identifiers = [];
    this.complexTypes = [];
    this.functions = [];
    this.tokens = this.lexer.allTokens();
    this.currentToken = 0;
    this.token = this.tokens[this.currentToken];
    this.errors = 0;
  }

  private error(expectedType: string) {
    const token = this.tokens[this.currentToken];
    if (token == this.errorToken) return;
    console.log(
      "ERROR: " + token.getType(),
      " at line " + token.getLine() + ", column " + token.getColumn(),
      "; Expected " + expectedType
    );

    this.errorToken = token;
    this.errors++;
    throw new Error(
      "Unexpected token type " + token.getType() + " expected " + expectedType
    );
  }

  private eatToken(expectedType: string): boolean {
    const actualType = this.token.getType();
    if (expectedType === actualType) {
      this.nextToken();
      return true;
    } else {
      this.error(expectedType);
      return false;
    }
  }

  private nextToken() {
    this.currentToken += 1;
    this.token = this.tokens[this.currentToken];
  }

  private skipTo(follow: string[]) {
    while (this.token.getType() != TokenTypes.EOF) {
      for (let skip of follow) {
        if (this.token.getType() == skip) return;
      }
      this.nextToken();
    }
  }

  public rewind() {
    this.currentToken = 0;
    this.token = this.tokens[this.currentToken];
  }

  public parseProgram() {
    this.statements = this.parseStatementList();
    this.eatToken(TokenTypes.EOF);
    return this.statements;
  }

  // integer | rune | string | boolean | complexUserOrReserved
  // reservedComplexType ::= user | repo | ciConfig | deployment | manifest
  // complexUserOrReserved ::= “complex” identifier | reservedComplexType
  private parseType(): string {
    let token = this.tokens[this.currentToken];
    switch (token.getType()) {
      case TokenTypes.Integer:
        this.eatToken(TokenTypes.Integer);

        return TokenTypes.Integer;

      case TokenTypes.Boolean:
        this.eatToken(TokenTypes.Boolean);

        return TokenTypes.Boolean;

      case TokenTypes.Rune:
        this.eatToken(TokenTypes.Rune);

        return TokenTypes.Rune;

      case TokenTypes.String:
        this.eatToken(TokenTypes.String);

        return TokenTypes.String;

      case TokenTypes.User:
        this.eatToken(TokenTypes.User);

        return TokenTypes.User;

      case TokenTypes.Repo:
        this.eatToken(TokenTypes.Repo);

        return TokenTypes.Repo;

      case TokenTypes.CiConfig:
        this.eatToken(TokenTypes.CiConfig);

        return TokenTypes.CiConfig;

      case TokenTypes.Deployment:
        this.eatToken(TokenTypes.Deployment);

        return TokenTypes.Deployment;

      case TokenTypes.Manifest:
        this.eatToken(TokenTypes.Manifest);

        return TokenTypes.Manifest;

      case TokenTypes.Complex:
        this.eatToken(TokenTypes.Complex);

        token = this.tokens[this.currentToken];
        this.eatToken(TokenTypes.Identifier);
        return token.getValue();

      default:
        // unknown type
        throw new Error(
          "Unknown type " +
            token.getValue() +
            " at line " +
            token.getLine() +
            " column " +
            token.getColumn()
        );
    }
  }

  private parseIdentifier(): string {
    const token = this.tokens[this.currentToken];
    let identifier = "";

    // grab ID value if token type is ID
    if (token.getType() == TokenTypes.Identifier) identifier = token.getValue();

    this.eatToken(TokenTypes.Identifier);

    return identifier;
  }

  private parseStatementList(): any[] {
    this.skipTo([
      TokenTypes.Semi,
      TokenTypes.If,
      TokenTypes.While,
      TokenTypes.Lparent,
      TokenTypes.Lbrace,
      TokenTypes.Identifier,
      TokenTypes.Complex,
      TokenTypes.Func,
      TokenTypes.Command,
      TokenTypes.Var
    ]);
    const statementList = [];
    while (this.isStatement()) statementList.push(this.parseStatement());
    return statementList;
  }

  private isStatement(): boolean {
    switch (this.token.getType()) {
      case TokenTypes.Semi:
        return true;
      case TokenTypes.If:
        return true;
      case TokenTypes.While:
        return true;
      case TokenTypes.Lparent:
        return true;
      case TokenTypes.Lbrace:
        return true;
      case TokenTypes.Identifier:
        return true;
      case TokenTypes.Complex:
        return true;
      case TokenTypes.Command:
        return true;
      case TokenTypes.Func:
        return true;
      case TokenTypes.Var:
        return true;
      default:
        return false;
    }
  }

  private parseBlock() {
    this.eatToken(TokenTypes.Lbrace);

    // recursively call parseStatement() until closing brace
    const stms = [];
    while (
      this.token.getType() != TokenTypes.Rbrace &&
      this.token.getType() != TokenTypes.EOF
    )
      stms.push(this.parseStatement());

    if (!this.eatToken(TokenTypes.Rbrace)) {
      this.skipTo([TokenTypes.Rbrace]);
      this.eatToken(TokenTypes.Rbrace);
    }

    return new BlockStatement(stms);
  }

  // type identifier
  private parseComplexField(): ComplexField {
    const type = this.parseType();
    const id = this.parseIdentifier();
    this.eatToken(TokenTypes.Semi);
    return new ComplexField(type, id);
  }

  // type identifier
  private parseFuncParameter(): FunctionParameter {
    const type = this.parseType();
    const id = this.parseIdentifier();
    return new FunctionParameter(type, id);
  }

  private parseComplexFields(): ComplexField[] {
    this.eatToken(TokenTypes.Lbrace);

    const fields = [];
    while (
      this.token.getType() != TokenTypes.Rbrace &&
      this.token.getType() != TokenTypes.EOF
    )
      fields.push(this.parseComplexField());

    this.eatToken(TokenTypes.Rbrace);
    return fields;
  }

  // “void” | type identifier {‘,’ type identifier}
  private parseFuncParameters(): FunctionParameter[] {
    this.eatToken(TokenTypes.Lparent);

    if (this.token.getType() === TokenTypes.Void) {
      // No params, skipping 'void)'
      this.eatToken(TokenTypes.Void);
      this.eatToken(TokenTypes.Rparent);
      return [];
    }

    // Parse first parameter
    const param = this.parseFuncParameter();
    const params = [param];

    while (this.token.getType() === TokenTypes.Comma) {
      this.eatToken(TokenTypes.Comma);
      params.push(this.parseFuncParameter());
    }

    this.eatToken(TokenTypes.Rparent);
    return params;
  }

  // expression {‘,’ expression}
  private parseFuncCallParameters(): Expression[] {
    this.eatToken(TokenTypes.Lparent);

    if (this.token.getType() === TokenTypes.Rparent) {
      // No params, skipping ')'
      this.eatToken(TokenTypes.Rparent);
      return [];
    }

    // Parse first parameter
    const param = this.parseExp();
    const params = [param];

    while (this.token.getType() === TokenTypes.Comma) {
      this.eatToken(TokenTypes.Comma);
      params.push(this.parseExp());
    }

    this.eatToken(TokenTypes.Rparent);
    return params;
  }

  private parseFieldAssignment(): FieldAssignment {
    const id = this.parseIdentifier();
    this.eatToken(TokenTypes.Assign);
    const value = this.parseExp();
    this.eatToken(TokenTypes.Semi);
    return { field: id, assignment: value };
  }

  private parseStatement(): Statement {
    // IfStatement ::=  if '('Exp')' Statement [else Statement]
    if (this.token.getType() == TokenTypes.If) {
      this.eatToken(TokenTypes.If);

      // parse conditional expression
      if (!this.eatToken(TokenTypes.Lparent))
        this.skipTo([TokenTypes.Rparent, TokenTypes.Lbrace, TokenTypes.Rbrace]);

      const condExp = this.parseExp();

      if (!this.eatToken(TokenTypes.Rparent))
        this.skipTo([TokenTypes.Lbrace, TokenTypes.Semi, TokenTypes.Rbrace]);

      // parse true and false statements
      let trueStm;

      // BLock ::= '{' StatementList '}'
      if (this.token.getType() == TokenTypes.Lbrace)
        trueStm = this.parseBlock();
      // parse true statement
      else trueStm = this.parseStatement();

      if (this.token.getType() == TokenTypes.Else) {
        if (!this.eatToken(TokenTypes.Else))
          this.skipTo([TokenTypes.Lbrace, TokenTypes.Semi, TokenTypes.Rbrace]);

        let falseStm: BlockStatement | Statement;

        // BLock ::= '{' StatementList '}'
        if (this.token.getType() == TokenTypes.Lbrace)
          falseStm = this.parseBlock();
        // parse false statement
        else falseStm = this.parseStatement();

        return new IfStatement(condExp, trueStm, falseStm);
      }
      return new IfStatement(condExp, trueStm, null);
    }

    // while ::= while '('Exp')' '{' statement {statement} '}'
    if (this.token.getType() == TokenTypes.While) {
      this.eatToken(TokenTypes.While);

      // parse looping condition
      if (!this.eatToken(TokenTypes.Lparent))
        this.skipTo([TokenTypes.Rparent, TokenTypes.Lbrace, TokenTypes.Rbrace]);

      const condExp = this.parseExp();

      if (!this.eatToken(TokenTypes.Rparent))
        this.skipTo([TokenTypes.Lbrace, TokenTypes.Semi, TokenTypes.Rbrace]);

      let loopStm: Statement[];

      this.eatToken(TokenTypes.Lbrace);

      loopStm = this.parseStatementList();
      this.eatToken(TokenTypes.Rbrace);

      return new WhileStatement(condExp, loopStm);
    }

    if (this.token.getType() === TokenTypes.Var) {
      this.eatToken(TokenTypes.Var);
      const type = this.parseType();
      const id = this.parseIdentifier();
      this.eatToken(TokenTypes.Semi);
      return new VarDeclaration(type, id);
    }

    // Identifier statement
    if (this.token.getType() == TokenTypes.Identifier) {
      const id = new Identifier(this.token.getValue());
      this.identifiers.push(id);
      this.eatToken(TokenTypes.Identifier);

      // Assignment statement: id = Exp ;
      if (this.token.getType() == TokenTypes.Assign) {
        this.eatToken(TokenTypes.Assign);

        // complex type assignment
        if (this.token.getType() === TokenTypes.Lbrace) {
          this.eatToken(TokenTypes.Lbrace);
          const values = [];
          while (
            this.token.getType() != TokenTypes.Rbrace &&
            this.token.getType() != TokenTypes.EOF
          )
            values.push(this.parseFieldAssignment());

          this.eatToken(TokenTypes.Rbrace);

          return new ComplexAssignStatement(id, values);
        }
        const value = this.parseExp();

        this.eatToken(TokenTypes.Semi);

        const assign = new AssignStatement(id, value);
        return assign;
      }

      // Postfix ops
      if (
        this.token.getType() === TokenTypes.PostIncrement ||
        this.token.getType() === TokenTypes.PostDecrement
      ) {
        if (this.token.getType() === TokenTypes.PostDecrement) {
          this.eatToken(TokenTypes.PostDecrement);
          this.eatToken(TokenTypes.Semi);
          return new PostDecrementStatement(id);
        }
        this.eatToken(TokenTypes.PostIncrement);
        this.eatToken(TokenTypes.Semi);
        return new PostIncrementStatement(id);
      }

      // field access with assignment
      if (this.token.getType() === TokenTypes.Dot) {
        this.eatToken(TokenTypes.Dot);
        const field = this.parseIdentifier();
        this.eatToken(TokenTypes.Assign);
        const value = this.parseExp();
        this.eatToken(TokenTypes.Semi);

        return new AccessAssignStatement(id.getValue(), field, value);
      }

      // func call
      if (this.token.getType() === TokenTypes.Lparent) {
        const params = this.parseFuncCallParameters();

        this.eatToken(TokenTypes.Semi);
        return new FuncCallStatement(id, params);
      }
    }

    if (
      this.token.getType() === TokenTypes.Command ||
      this.token.getType() === TokenTypes.Func
    ) {
      const isFunc = this.token.getType() === TokenTypes.Func;
      this.eatToken(this.token.getType());
      let type = null;
      if (isFunc) {
        // Parse return type
        type = this.parseType();
      }
      const funcName = this.parseIdentifier();
      // Parameter types list
      const params = this.parseFuncParameters();
      const funcBody = this.parseBlock();

      const func = new Func(funcName, params, funcBody, type);
      this.functions.push(func);
      return func;
    }

    if (this.token.getType() === TokenTypes.Return) {
      this.eatToken(TokenTypes.Return);

      // Looking to see if it's a void return;
      if (this.token.getType() === TokenTypes.Semi) {
        this.eatToken(TokenTypes.Semi);
        return new ReturnStatement(null);
      }

      const value = this.parseExp();

      this.eatToken(TokenTypes.Semi);

      return new ReturnStatement(value);
    }

    // Complex type specification statement
    if (this.token.getType() === TokenTypes.Complex) {
      this.eatToken(TokenTypes.Complex);
      const id = this.parseIdentifier();

      this.skipTo([TokenTypes.Lbrace]);
      const typeFields = this.parseComplexFields();
      const complexType = new ComplexType(id, typeFields);
      this.complexTypes.push(complexType);
      return complexType;
    }
    // statement type unknown
    this.eatToken(TokenTypes.Unknown);
    this.nextToken();
    return null;
  }

  private parseExp(): Expression {
    const lhs = this.parsePrimaryExp();
    return this.parseBinopRHS(0, lhs); // check for binops following exp
  }

  private parsePrimaryExp(): Expression {
    switch (this.token.getType()) {
      case TokenTypes.IntegerLiteral:
        const intValue = Number(this.token.getValue());
        this.eatToken(TokenTypes.IntegerLiteral);
        return new IntegerLiteral(intValue);

      case TokenTypes.BooleanLiteral:
        const booleanVal = CharUtils.returnBooleanValue(this.token.getValue());
        this.eatToken(TokenTypes.BooleanLiteral);
        return new BooleanLiteral(booleanVal);

      case TokenTypes.RuneLiteral:
        const runeVal = this.token.getValue();
        this.eatToken(TokenTypes.RuneLiteral);
        return new RuneLiteral(runeVal);

      case TokenTypes.StringLiteral:
        const stringVal = this.token.getValue();
        this.eatToken(TokenTypes.StringLiteral);
        return new StringLiteral(stringVal);

      case TokenTypes.Identifier:
        const id = this.parseIdentifier();
        this.identifiers.push(id);
        // Check if it's a func call so func calls can be expressions
        if (this.token.getType() === TokenTypes.Lparent) {
          const params = this.parseFuncCallParameters();
          return new FuncCallExpression(id, params);
        }
        return new IdentifierExpression(id);

      case TokenTypes.Not:
        this.eatToken(TokenTypes.Not);
        return new NotExpression(this.parseExp());

      case TokenTypes.Minus:
        this.eatToken(TokenTypes.Minus);
        return new NegativeExpression(this.parseExp());

      case TokenTypes.Lparent:
        this.eatToken(TokenTypes.Lparent);
        const exp = this.parseExp();
        this.eatToken(TokenTypes.Rparent);
        return exp;

      default:
        // unrecognizable expression
        this.eatToken(TokenTypes.Unknown);
        this.nextToken();
        return null;
    }
  }

  private parseBinopRHS(level: number, lhs: Expression): Expression {
    // continuously parse exp until a lower order operator comes up
    while (true) {
      // grab operator precedence (-1 for non-operator token)
      let val = this.binopLevels[this.token.getType()];
      const tokenLevel = val !== undefined ? val : -1;

      // either op precedence is lower than prev op or token is not an op
      if (tokenLevel < level) return lhs;

      // save binop before parsing rhs of exp
      const binop = this.token.getType();
      this.eatToken(binop);

      let rhs = this.parsePrimaryExp(); // parse rhs of exp

      // grab operator precedence (-1 for non-operator token)
      val = this.binopLevels[this.token.getType()];
      const nextLevel = val !== undefined ? val : -1;

      // if next op has higher precedence than prev op, make recursive call
      if (tokenLevel < nextLevel) rhs = this.parseBinopRHS(tokenLevel + 1, rhs);

      // build AST for exp
      switch (binop) {
        case TokenTypes.And:
          lhs = new AndExpression(lhs, rhs);
          break;
        case TokenTypes.Or:
          lhs = new OrExpression(lhs, rhs);
          break;
        case TokenTypes.Eq:
          lhs = new EqualExpression(lhs, rhs);
          break;
        case TokenTypes.Neq:
          lhs = new NotEqualExpression(lhs, rhs);
          break;
        case TokenTypes.Lt:
          lhs = new LessThanExpression(lhs, rhs);
          break;
        case TokenTypes.Rt:
          lhs = new GreaterThanExpression(lhs, rhs);
          break;
        case TokenTypes.LtEq:
          lhs = new LessThanEqualExpression(lhs, rhs);
          break;
        case TokenTypes.RtEq:
          lhs = new GreaterThanEqualExpression(lhs, rhs);
          break;
        case TokenTypes.Plus:
          lhs = new PlusExpression(lhs, rhs);
          break;
        case TokenTypes.Minus:
          lhs = new MinusExpression(lhs, rhs);
          break;
        case TokenTypes.Times:
          lhs = new TimesExpression(lhs, rhs);
          break;
        case TokenTypes.Div:
          lhs = new DivExpression(lhs, rhs);
          break;
        case TokenTypes.Dot:
          const idLhs = lhs as IdentifierExpression;
          const idRhs = rhs as IdentifierExpression;
          lhs = new FieldAccessExpression(idLhs, idRhs);
          break;
        default:
          this.eatToken(TokenTypes.Unknown);
          break;
      }
    }
  }
}
