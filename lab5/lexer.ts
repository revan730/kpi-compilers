import * as CharUtils from './charUtils';
import { NumberFSM } from './numberFSM';
import { Token, TokenTypes } from './token';

export class Lexer {
    private input: string;
    private position: number;
    private line: number;
    private column: number;

    constructor(input: string) {
        this.input = this.stripFinalNewline(input);
        this.column = 1;
        this.line = 1;
        this.position = 0;
    }

    private stripFinalNewline(input: string): string {
        const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt(0);
        const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt(0);
        if (input[input.length - 1] === LF) {
            input = input.slice(0, input.length - 1);
        }

        if (input[input.length - 1] === CR) {
            input = input.slice(0, input.length - 1);
        }
        return input;
    }

    public allTokens() {
        let token = this.nextToken();
        let tokens = [];
   
        while (token.getType() !== TokenTypes.EOF) {
            tokens.push(token);
            token = this.nextToken();
        }

        tokens.push(token);

        return tokens;
    }

    private nextToken(): Token {
        if (this.position >= this.input.length) {
            return new Token(TokenTypes.EOF, '', this.line, this.column);
        }

        this.skipWhitespacesAndNewLines();

        const character = this.input.charAt(this.position);

        if (CharUtils.isLetter(character)) {
            return this.recognizeIdentifier();
        }

        if (CharUtils.isDigit(character)) {
            return this.recognizeNumber();
        }

        if (character === '"') {
            return this.recognizeString();
        }

        if (character === "'") {
            return this.recognizeRune();
        }

        if (CharUtils.isOperator(character)) {
            return this.recognizeOperator();
        }

        if (CharUtils.isParenthesis(character)) {
            return this.recognizeParenthesis();
        }

        if (CharUtils.isPunctuation(character)) {
            return this.recognizePunctuation();
        }

        if (CharUtils.isBracket(character)) {
            return this.recognizeBracket();
        }

        throw new Error(`Unrecognized character ${character.charCodeAt(0)} at line ${this.line} and column ${this.column}.`);
    }

    private skipWhitespacesAndNewLines() {
        while (this.position < this.input.length && CharUtils.isWhitespaceOrNewLine(this.input.charAt(this.position))) {
           if (CharUtils.isNewLine(this.input.charAt(this.position))) {
               this.line += 1;
               this.column = 1;
            } else {
                this.column += 1;
            }
            this.position += 1;
        }
    }

    private recognizeParenthesis(): Token {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);


        this.position += 1;
        this.column += 1;

        if (character === '(') {
            return new Token(TokenTypes.Lparent, '(', line, column);
        }

        return new Token(TokenTypes.Rparent, ')', line, column);
    }

    private recognizePunctuation(): Token {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);


        this.position += 1;
        this.column += 1;

        if (character === ';') {
            return new Token(TokenTypes.Semi, ';', line, column);
        }

        return new Token(TokenTypes.Comma, ',', line, column);
    }

    private recognizeBracket(): Token {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);


        this.position += 1;
        this.column += 1;

        if (character === '{') {
            return new Token(TokenTypes.Lbrace, '{', line, column);
        }

        return new Token(TokenTypes.Rbrace, '}', line, column);
    }

    private recognizeOperator() {
        let character = this.input.charAt(this.position);

        if (CharUtils.isComparisonOperator(character)) {
            return this.recognizeComparisonOperator();
        }

        if (CharUtils.isArithmeticOperator(character)) {
            return this.recognizeArithmeticOperator();
        }

        if (CharUtils.isLogicalOperator(character)) {
            return this.recognizeLogicalOperator();
        }
    }

    private recognizeLogicalOperator() {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        let lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;

        let isLookaheadAmpSymbol = lookahead !== null && lookahead === '&';
        let isLookaheadPipeSymbol = lookahead !== null && lookahead === '|';

        this.position += 1;
        this.column += 1;

        if (isLookaheadAmpSymbol || isLookaheadPipeSymbol) {
            this.position += 1;
            this.column += 1;
        }

        switch (character) {
            case '&':
                return isLookaheadAmpSymbol
                    ? new Token(TokenTypes.And, '&&', line, column)
                    : new Token(TokenTypes.Amp, '&', line, column);

            case '|':
                return isLookaheadPipeSymbol
                    ? new Token(TokenTypes.Or, '||', line, column)
                    : new Token(TokenTypes.Unknown, character + lookahead, line, column);

            default:
                break;
        }
    }

    private recognizeComparisonOperator() {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        let lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;

        // Whether the 'lookahead' character is the equal symbol '='.
        let isLookaheadEqualSymbol = lookahead !== null && lookahead === '=';

        this.position += 1;
        this.column += 1;

        if (isLookaheadEqualSymbol) {
            this.position += 1;
            this.column += 1;
        }

        switch (character) {
            case '>':
                return isLookaheadEqualSymbol
                    ? new Token(TokenTypes.RtEq, '>=', line, column)
                    : new Token(TokenTypes.Rt, '>', line, column);

            case '<':
                return isLookaheadEqualSymbol
                    ? new Token(TokenTypes.LtEq, '<=', line, column)
                    : new Token(TokenTypes.Lt, '<', line, column);

            case '=':
                return isLookaheadEqualSymbol
                    ? new Token(TokenTypes.Eq, '==', line, column)
                    : new Token(TokenTypes.Assign, '=', line, column);

            case '!':
                return isLookaheadEqualSymbol
                    ? new Token(TokenTypes.Neq, '!=', line, column)
                    : new Token(TokenTypes.Not, '!', line, column);

            default:
                break;
        }
    }
    
    private recognizeArithmeticOperator() {
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        let lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        
        // Whether the 'lookahead' character is the equal symbol '='.
        let isLookaheadPlusSymbol = lookahead !== null && lookahead === '+';
        let isLookaheadMinusSymbol = lookahead !== null && lookahead === '-';
        
        this.position += 1;
        this.column += 1;

        if (isLookaheadPlusSymbol || isLookaheadMinusSymbol) {
            this.position += 1;
            this.column += 1;
        }
    
        switch (character) {
            case '+':
                return isLookaheadPlusSymbol
                    ? new Token(TokenTypes.PostIncrement, '++', line, column)
                    : new Token(TokenTypes.Plus, '+', line, column);
                
            case '-':
                return isLookaheadMinusSymbol
                    ? new Token(TokenTypes.PostDecrement, '--', line, column)
                    : new Token(TokenTypes.Minus, '-', line, column);
                
            case '*':
                return new Token(TokenTypes.Times, '*', line, column);
                
            case '/':
                return new Token(TokenTypes.Div, '/', line, column);

            case '.': // Not really an arithmetic op, but fit here so well
                return new Token(TokenTypes.Dot, '.', line, column);

            default:
                break;
        }
    }
    
    private recognizeIdentifier() {
        let identifier = '';
        let line = this.line;
        let column = this.column;
        let position = this.position;
    
        while (position < this.input.length) {
            let character = this.input.charAt(position);
      
            if (!(CharUtils.isLetter(character) || CharUtils.isDigit(character) || character === '_')) {
            break;
            }
        
            identifier += character;
            position += 1;
        }
    
        this.position += identifier.length;
        this.column += identifier.length;

        if (CharUtils.isIdentifierReserved(identifier)) {
            return new Token(identifier, identifier, line, column);
        }
        if (CharUtils.isBooleanLiteral(identifier)) {
            return new Token(TokenTypes.BooleanLiteral, identifier, line, column);
        }
    
        return new Token(TokenTypes.Identifier, identifier, line, column);
    }

    private recognizeNumber() {
        let line = this.line;
        let column = this.column;
    
        // We delegate the building of the FSM to a helper method.
        let fsm = new NumberFSM();
        
        // The input to the FSM will be all the characters from
        // the current position to the rest of the lexer's input.
        let fsmInput = this.input.substring(this.position);
        
        // Here, in addition of the FSM returning whether a number
        // has been recognized or not, it also returns the number
        // recognized in the 'number' variable. If no number has
        // been recognized, 'number' will be 'null'.
        let { recognized, value } = fsm.run(fsmInput);
        if (recognized) {
            this.position += value.length;
            this.column += value.length;

            
            return new Token(TokenTypes.IntegerLiteral, value, line, column);
        }
        
        // ...
    }

    private recognizeString(): Token {
        let line = this.line;
        let column = this.column;
        const results = /"(\\.|[^"\\])*\"/.exec(this.input.substring(this.position));
        if (!results) {
            return new Token(TokenTypes.Unknown, '', line, column);
        }
        this.position += results[0].length;
        this.column += results[0].length;
        return new Token(TokenTypes.StringLiteral, results[0].replace(/["]+/g, ''), line, column);
    }

    private recognizeRune(): Token {
        let line = this.line;
        let column = this.column;
        const results = /^'\w'/.exec(this.input.substring(this.position));
        if (!results) {
            return new Token(TokenTypes.Unknown, '', line, column);
        }
        this.position += results[0].length;
        this.column += results[0].length;
        return new Token(TokenTypes.RuneLiteral, results[0], line, column); 
    }
}