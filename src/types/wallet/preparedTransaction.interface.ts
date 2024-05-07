
export interface PREPARED_TRANSACTION {
	_id?: any
	coinName: string
	recruiterSum: number
	staffSum: number
	staffWallet: string
	recruiterWallet: string | null
	balanceSum: number
}