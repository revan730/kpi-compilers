import { TokenTypes } from './token';

const operators = [
    TokenTypes.Pipe,
    TokenTypes.Amp,
    TokenTypes.Not,
    TokenTypes.And,
    TokenTypes.Or,
    TokenTypes.Eq,
    TokenTypes.Neq,
    TokenTypes.Lt,
    TokenTypes.Rt,
    TokenTypes.LtEq,
    TokenTypes.RtEq,
    TokenTypes.Plus,
    TokenTypes.Minus,
    TokenTypes.Times,
    TokenTypes.Div,
    TokenTypes.Assign,
    TokenTypes.Dot,
    TokenTypes.PostIncrement,
    TokenTypes.PostDecrement,
]

const reserved = [
    TokenTypes.Integer,
    TokenTypes.Rune,
    TokenTypes.String,
    TokenTypes.Boolean,
    TokenTypes.User,
    TokenTypes.Repo,
    TokenTypes.CiConfig,
    TokenTypes.Deployment,
    TokenTypes.Manifest,
    TokenTypes.If,
    TokenTypes.Else,
    TokenTypes.While,
    TokenTypes.Void,
    TokenTypes.Var,
    TokenTypes.Complex,
    TokenTypes.Return,
    TokenTypes.Command,
    TokenTypes.Func,
]

const postfixOperators = [
    '+',
    '-',
]

const compOperators = [
    '=',
    '!',
    '<',
    '>',
]

const logicalOperators = [
    '&',
    '|',
]

const punctuationChars = [
    ';',
    ','
]

const arithmeticOperators = [
    TokenTypes.Plus,
    TokenTypes.Minus,
    TokenTypes.Times,
    TokenTypes.Div,
    TokenTypes.Dot,
]

export function isLetter(character: string): boolean {
    return /^[a-zA-Z]$/gm.test(character);
}

export function isDigit(character: string): boolean {
    return /^[0-9]$/gm.test(character);
}

export function isOperator(character: string): boolean {
    return operators.indexOf(character) !== -1;
}

export function isComparisonOperator(character: string): boolean {
    return compOperators.indexOf(character) !== -1;
}

export function isArithmeticOperator(character: string): boolean {
    return arithmeticOperators.indexOf(character) !== -1;
}

export function isPostfixOperator(character: string): boolean {
    return postfixOperators.indexOf(character) !== -1;
}

export function isLogicalOperator(character: string): boolean {
    return logicalOperators.indexOf(character) !== -1;
}

export function isParenthesis(character: string): boolean {
    return character === '(' || character === ')';
}

export function isNewLine(character: string): boolean {
    return /\n/.test(character);
}

export function isWhitespaceOrNewLine(character: string): boolean {
    return character === ' ' || character === '\t' || isNewLine(character);
}

export function isPunctuation(character: string): boolean {
    return punctuationChars.indexOf(character) !== -1;
}

export function isIdentifierReserved(character: string): boolean {
    return reserved.indexOf(character) !== -1;
}

export function isBracket(character: string): boolean {
    return character === '{' || character === '}';
}

export function isBooleanLiteral(identifier: string): boolean {
    return identifier === 'true' || identifier === 'false';
}

export function returnBooleanValue(stringBoolean: string): boolean {
    if (stringBoolean === 'true') {
        return true;
    } else {
        return false;
    }
}
