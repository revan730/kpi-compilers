import { StringFSM } from './stringFSM';

const fsm = new StringFSM();
console.log(fsm.run('12'));
console.log(fsm.run('ebat'));
console.log(fsm.run('"lol"'));