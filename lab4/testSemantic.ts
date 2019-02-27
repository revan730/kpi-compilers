import { SemanticAnalyzer } from './semantic';
import * as fs from 'fs';

fs.readFile('testInput1.st', 'utf8', function(err, contents) {
    const p = new SemanticAnalyzer(contents);
    try {
        p.analyzeFile();
    } catch (err) {
        console.log(err);
    }
});
