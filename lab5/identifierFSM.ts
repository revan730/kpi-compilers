import { FSM } from './FSM';
import * as CharUtils from './charUtils';

export function createFSM(): FSM {
    const states = new Set([1, 2]);
    const initialState = 1;
    const acceptingStates = new Set([2]);
    const nextState = (currentState: any, character: string) => {
        switch (currentState) {
            case 1:
                if (CharUtils.isLetter(character) || character === '_') {
                    return 2;
                }
                break;
                
            case 2:
                if (CharUtils.isLetter(character) || CharUtils.isDigit(character) || character === '_') {
                    return 2;
                }
                break;
        }
        
        return FSM.NoNextState;
    }
    const fsm = new FSM(states, initialState, acceptingStates, nextState);
    return fsm;
}