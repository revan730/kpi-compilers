import { NumberFSM } from './numberFSM';

const fsm = new NumberFSM();
console.log(fsm.run('12'));
console.log(fsm.run('ebat'));