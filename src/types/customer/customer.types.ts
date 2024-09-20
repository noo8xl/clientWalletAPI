import {FIAT_NAME} from "../wallet/wallet.types";

export type CUSTOMER = {
	_id?: string
	userEmail: string
	domainName: string
	companyName: string
}


export type CUSTOMER_PARAMS = {
	_id?: string
	apiKey: string
	isActive: boolean
	fiatName: FIAT_NAME
	telegramId: number
	createdAt: number
	updatedAt: number
	customerId: string
}

export type GET_ACTIONS_LIST = {
	userId: string
	skip: number
	limit: number
}