
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types"

// this is a factory for the entire Wallet
export interface Wallet {

	// create a wallet
  createWallet(): Promise<string>;
	// get a wallet entity
  getWallet(): Promise<WALLET>;
	// get balance of the wallet
  getBalance(): Promise<number>;
	// send p2p transaction
  sendTransaction(): Promise<string>; // -> get list of wallets by coinName -> pay it 
	// get transaction details
  getTransactionInfo(): Promise<any>;

}

