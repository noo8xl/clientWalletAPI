
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types"

// this is a factory for the Wallet area of the app
export interface Wallet {

	// create a wallet
  createWallet(): Promise<string>;
	// get a wallet entity
  getWallet(): Promise<WALLET>;
	// get balance of the wallet
  getBalance(): Promise<number>;
	// send p2p transaction
  sendTransaction(): Promise<string>;
	// get transaction details
  getTransactionInfo(): Promise<any>;

	// get rate data
  getRate(): Promise<RATE_DATA>;

}
