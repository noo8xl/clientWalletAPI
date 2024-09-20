import {IsEnum, IsInstance, IsInt, IsNumber, IsString} from "class-validator";
import {TransactionDetails} from "./TransactionDetails";
import {COIN_NAME_LIST} from "../../types/wallet/wallet.types";



export class Transaction {

	@IsEnum(COIN_NAME_LIST)
	private coinName: COIN_NAME_LIST
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
		coinName: COIN_NAME_LIST, recruiterSum: number, staffSum: number,
		staffWallet: string, recruiterWallet: string, balanceSum: number ): void {

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