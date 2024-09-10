

export class Wallet {

	userId: string
	coinName: string
	address: string
	privateKey: string // Buffer -> available str value with toString()
	publicKey: string // Buffer ->  available str value with toString()
	seedPhrase?: string // Buffer ->  available str value with toString()
	mnemonic?: string
	isUsed: boolean // if the wallet has balance
	isChecked: boolean // if the wallet was checked by balance parser
	balance: number

}