import { TokenTypes, Token } from './token';
import { Lexer } from './lexer';
import { VarDeclaration } from './varDeclaration';

export class Parser {
    private binopLevels: any;
    private declarations: any;
    private identifiers: any;
    private assigns: any;
    private conditions: any;
    private statements: any;
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
        this.binopLevels[TokenTypes.Lbrace] = 50;
    }
    constructor(input: string) {
        this.initBinopLevels();
        this.lexer = new Lexer(input);
        this.declarations = [];
        this.identifiers = [];
        this.assigns = [];
        this.conditions = [];
        this.tokens = this.lexer.allTokens();
        this.currentToken = 0;
        this.token = this.tokens[this.currentToken];
        this.errors = 0;
    }

    private error(expectedType: string) {
        const token = this.tokens[this.currentToken];
		if (token == this.errorToken)
			return;
        console.log("ERROR: " + token.getType(),
        " at line " + token.getLine() + ", column " + token.getColumn(),
        "; Expected " + expectedType);
				
		this.errorToken = token;
		this.errors++;
	}

    private eatToken(expectedType: string): boolean {
        const actualType = this.token.getType();
        if (expectedType === actualType) {
            this.nextToken();
            return true;
        } else {
            this.error(expectedType);
        }
    }

    private nextToken() {
        this.currentToken += 1;
        this.token = this.tokens[this.currentToken];
    }

    private skipTo(follow: string[]) {
		while (this.token.getType() != TokenTypes.EOF) {
			for (let skip of follow) {
				if (this.token.getType() == skip)
					return;
            }
            this.nextToken();
		}
    }

    public parseProgram() {		
        this.declarations = this.parseDeclarations();
        //this.statements = this.parseStatementList();
        // TODO: To be continued
		this.eatToken(TokenTypes.EOF);
	}

    private parseDeclarations(): any[] {
        const declarations = [];

        this.skipTo([TokenTypes.Var]);

		while(this.token.getType() != TokenTypes.EOF) {
            const varDecl = this.parseVarDecl();
		    declarations.push(varDecl);
            this.declarations.push(varDecl);
            this.eatToken(TokenTypes.Semi);
            this.skipTo([TokenTypes.Var]);
        }

		return declarations;
    }
    
    
    private parseVarDecl(): VarDeclaration {
        this.eatToken(TokenTypes.Var);
		const type = this.parseType();
		const id = this.parseIdentifier();
		return new VarDeclaration(type, id);
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
			throw new Error('Unknown type ' + token.getValue() + ' at line ' + token.getLine() + ' column ' + token.getColumn());
		}
    }
    
    private parseIdentifier(): string {
        const token = this.tokens[this.currentToken];
        let identifier = '';

		// grab ID value if token type is ID
		if (token.getType() == TokenTypes.Identifier)
			identifier =  token.getValue();
		
		this.eatToken(TokenTypes.Identifier);

		return identifier;
	}

}