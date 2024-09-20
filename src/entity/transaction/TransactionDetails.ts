import {IsEnum, IsNumber, IsString} from "class-validator";
import {COIN_NAME_LIST, WALLET_KEYS} from "../../types/wallet/wallet.types";



export class TransactionDetails {

	@IsString()
	private domainName: string
	@IsEnum(COIN_NAME_LIST)
	private coinName: COIN_NAME_LIST
	@IsString()
	private fromAddress: string

	private keyData: WALLET_KEYS

	@IsNumber()
	private balance: number
	@IsString()
	private userId: string

	public setTransactionDetails(
		domainName: string, coinName: COIN_NAME_LIST, fromAddress: string,
		keyObj: WALLET_KEYS, balance: number, userId: string): void {

		this.domainName = domainName
		this.coinName = coinName
		this.fromAddress = fromAddress
		this.keyData = keyObj
		this.balance = balance
		this.userId = userId
	}

	public getTransactionDetails(): TransactionDetails {
		return this;
	}

}