import { Statement } from "./statement";

export class BlockStatement implements Statement {
    private statementList: Statement[];

    constructor(statementList: Statement[]) {
        this.statementList = statementList;
    }
	
	public getStatementsList(): Statement[] {
		return this.statementList;
	}	
}