import {IsDate, IsEnum, IsString} from "class-validator";
import {ACTION_STATUS} from "./ActionStatus";

export class ActionLog {

	@IsString()
	private userId: string
	@IsDate()
	private date: number
	@IsEnum(ACTION_STATUS)
	private status: ACTION_STATUS
	@IsString()
	private action: string

	constructor() {}

	public setAction(userId: string, date: number, status: ACTION_STATUS, action: string): void {
		this.userId = userId
		this.date = date
		this.status = status
		this.action = action
	}

	public getAction(): ActionLog {
		return this
	}

}
