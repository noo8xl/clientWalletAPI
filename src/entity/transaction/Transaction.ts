import {IsEnum, IsInstance, IsInt, IsNumber, IsString, ValidateIf, ValidateNested} from "class-validator";
import {TransactionDetails} from "./TransactionDetails";
import {CoinNames} from "../crypto/CoinNames";


export class Transaction {

	@IsInt()
	private _id?: number
	@IsEnum(CoinNames)
	private coinName: CoinNames
	@IsInt()
	private recruiterSum: number
	@IsInt()
	private staffSum: number
	@IsString()
	private staffWallet: string
	// @ValidateIf()
	private recruiterWallet: string
	@IsNumber()
	private balanceSum: number

	@IsInstance(TransactionDetails)
	private transactionDetails: TransactionDetails

	constructor() {}

	public setTransaction(
		id: number, coinName: CoinNames, recruiterSum: number, staffSum: number,
		staffWallet: string, recruiterWallet: string, balanceSum: number ): void {

		this._id = id
		this.coinName = coinName
		if (recruiterSum !== null) this.recruiterSum = recruiterSum
		this.staffSum = staffSum
		if (recruiterWallet !== null) this.recruiterWallet = recruiterWallet
		this.staffWallet = staffWallet
		this.balanceSum =	balanceSum
	}

	public setTransactionDetails(transactionDetails: TransactionDetails): void {
		this.transactionDetails = transactionDetails;
	}

	public getTransactionDetails(): TransactionDetails {
		return this.transactionDetails;
	}

	public getPreparedTransaction(): Transaction {
		return this;
	}



}