

export type ACCOUNT_WALLET = ACCOUNT_WALLET_ITEM[]
export type WALLET_LIST = WALLET_DATA[]

export type ACCOUNT_WALLET_ITEM = {
    coinName: string
    coinBalance: number
}


// WALLET_DATA -> describe wallet obj details (private key, public key, etc.)
export type WALLET_DATA = {
	coinName: string
	address: string
	privateKey: any
	publicKey: any
	seed?: string
  userId: any
  domainName: string
  dateOfCreate: number
}
