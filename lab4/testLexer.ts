import { Lexer } from './lexer';
import * as fs from 'fs';

fs.readFile('testInput1.st', 'utf8', function(err, contents) {
    const l = new Lexer(contents);
    console.log(l.allTokens());
});
