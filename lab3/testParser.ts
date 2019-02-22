import { Parser } from './parser';
import * as fs from 'fs';

fs.readFile('testInput1.st', 'utf8', function(err, contents) {
    const l = new Parser(contents);
    console.log(l.parseProgram());
});
