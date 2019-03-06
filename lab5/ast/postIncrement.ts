import { Statement } from "./statement";
import { Identifier } from "./identifier";

export class PostIncrementStatement implements Statement {
    private id: Identifier;
    constructor(id: Identifier) {
        this.id = id;
    }

    public getId(): Identifier {
		return this.id;
	}
}