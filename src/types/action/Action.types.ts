
export type ACTION = {
	_id?: string
	date?: number
	action: string
	customerId: string
}

export type GET_ACTIONS_LIST = {
	userId: string
	skip: number
	limit: number
}