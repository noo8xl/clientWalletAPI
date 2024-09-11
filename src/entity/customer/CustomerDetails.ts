import {IsBoolean, IsDate, IsEnum, IsNumber, IsString} from "class-validator";
import {FIAT_NAME} from "./FiatName";
import process from "node:process";

export class CustomerDetails {

	@IsNumber()
	private telegramId: number
	@IsEnum(FIAT_NAME)
	private fiatName: FIAT_NAME = FIAT_NAME.USD
	@IsBoolean()
	private isActive: boolean = true
	@IsDate()
	private createdAt: number = new Date().getTime()
	@IsDate()
	private updatedAt: number = new Date().getTime()
	@IsString()
	private userId: string

	constructor() {}

	public setDefault(telegramId: number, userId: string): void {
		this.telegramId = telegramId
		this.userId = userId
		// console.log(this)
		process.stdout.write(this.toString())
	}

	public setCustomerDetails(
		telegramId: number, fiatName: FIAT_NAME, isActive: boolean,
		updatedAt: number, createdAt: number, userId: string): void {
		this.telegramId = telegramId
		this.fiatName = fiatName
		this.isActive = isActive
		this.updatedAt = updatedAt
		this.createdAt = createdAt
		this.userId = userId
	}

	public getTelegramId(): number {
		return this.telegramId;
	}

	public getCustomerDetails(): CustomerDetails {
		return this;
	}

}