import { Statement } from "./statement";
import { Expression } from "./expression";
import { BlockStatement } from "./block";

export class IfStatement implements Statement {
    private condExp: Expression;
    private trueStm: Statement;
    private falseStm: Statement;

    constructor(condExp: Expression, trueStm: Statement, falseStm: Statement) {
        this.condExp = condExp;
        this.trueStm = trueStm;
        this.falseStm = falseStm;
    }

    public getCondExp(): Expression {
		return this.condExp;
	}
	
	public getTrueStm(): Statement {
		return this.trueStm;
  }
  
  public getTrueStmArr(): Statement[] {
    const block = this.trueStm as BlockStatement;
    return block.getStatementsList();
  }
  
	public getFalseStm(): Statement {
		return this.falseStm;
  }

  public getFalseStmArr(): Statement[] {
    const block = this.falseStm as BlockStatement;
    return block.getStatementsList();
  }

  public hasFalseBlock(): boolean {
    return !!this.falseStm;
  }
}
