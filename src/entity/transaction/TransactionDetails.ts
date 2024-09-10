import {IsEnum, IsInt, IsNumber, IsString} from "class-validator";
import {CoinNames} from "../crypto/CoinNames";
import {WALLET_KEYS} from "../crypto/KeyObj";


export class TransactionDetails {

	@IsInt()
	private _id?: number
	@IsString()
	private domainName: string
	@IsEnum(CoinNames)
	private coinName: CoinNames
	@IsString()
	private fromAddress: string

	private keyData: WALLET_KEYS

	@IsNumber()
	private balance: number
	@IsString()
	private userId: string

	public setTransactionDetails(
		id: number, domainName: string, coinName: CoinNames, fromAddress: string,
		keyObj: WALLET_KEYS, balance: number, userId: string): void {
		this._id = id
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