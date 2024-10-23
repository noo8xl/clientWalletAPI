

export type WALLET_REQUEST_DTO = {
	userId?: string
	coinName: string
	address?: string
	addressTo?: string
	amountInCrypto?: number
}

export type GET_BALANCE_DTO = {
	coinName: string
	coinBalance: number
	currencyType: string
	fiatValue: number
}

export type GET_WALLET_DETAILS_DTO = {
	walletId: number
	createdAt: number
}

// export type WALLET_LIST = {

// }