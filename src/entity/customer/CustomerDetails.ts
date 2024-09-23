import {IsBoolean, IsDate, IsEnum, IsNumber, IsString} from "class-validator";
import {FIAT_NAME} from "../../types/wallet/wallet.types";
import {CUSTOMER_PARAMS} from "../../types/customer/customer.types";


export class CustomerDetails {

	@IsString()
	private apiKey: string
	@IsNumber()
	private telegramId: number
	@IsEnum(FIAT_NAME)
	private fiatName: FIAT_NAME
	@IsBoolean()
	private isActive: boolean
	@IsDate()
	private createdAt: number
	@IsDate()
	private updatedAt: number
	@IsString()
	private customerId: string

	constructor() {}

	public setCustomerDetails( params: CUSTOMER_PARAMS ): void {
		this.apiKey = params.apiKey
		this.telegramId = params.telegramId
		this.fiatName = params.fiatName
		this.isActive = params.isActive
		this.updatedAt = params.updatedAt
		this.createdAt = params.createdAt
		this.customerId = params.customerId
	}

	public getTelegramId(): number {
		return this.telegramId;
	}

	public getCustomerDetails(): CustomerDetails {
		return this;
	}

}