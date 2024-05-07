
export interface TSX_DATA {
	_id?: any
	domainName: string
  coinName: string
	fromAddress: string
	keyData: {
		privateKey: any
		publicKey: any
	}
	balance: number
	userId: string
}