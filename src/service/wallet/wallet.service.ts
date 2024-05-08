
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types"

export abstract class Wallet {
  coinName: string

  constructor(coinName: string){
    this.coinName = coinName
  }

  abstract createWallet(): Promise<string>;
  abstract getWallet(): Promise<WALLET>;
  abstract getBalance(): Promise<number>;
  abstract sendTransaction(): Promise<string>;
  abstract getTransactionInfo(): Promise<any>;

  abstract getRate(): Promise<RATE_DATA>;

  // hasBalance : bool 
  // used: bool
  // balance: int
  // 
  //
  //
}

