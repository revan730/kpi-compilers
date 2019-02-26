import { createFSM } from './identifierFSM';

const fsm = createFSM();
console.log(fsm.run('0wrong'));
console.log(fsm.run('right'));
console.log(fsm.run('Still_Right1'));