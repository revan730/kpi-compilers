
import * as fs from 'fs';
import { Interpreter } from './interpreter';

fs.readFile('testInput2.st', 'utf8', function(err, contents) {
    const i = new Interpreter(contents);
    try {
        i.interpretFile();
    } catch (err) {
        console.log(err);
    }
});
