import {IsDate, IsString} from "class-validator";
import {ACTION} from "../../types/action/Action.types";

export class ActionLog {

	@IsDate()
	private date: number

	@IsString()
	private action: string

	@IsString()
	private customerId: string

	constructor() {}

	public setAction(actionLog: ACTION): void {
		this.date = actionLog.date
		this.action = actionLog.action
		this.customerId = actionLog.customerId
	}

	public getAction(): ActionLog {
		return this
	}

}
