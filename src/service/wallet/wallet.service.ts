
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types"

export abstract class Wallet {
  coinName: string

  constructor(coinName: string) { this.coinName = coinName }

  public abstract createWallet(): Promise<string>;
  public abstract getWallet(): Promise<WALLET>;
  public abstract getBalance(): Promise<number>;
  public abstract sendTransaction(): Promise<string>;
  public abstract getTransactionInfo(): Promise<any>;

  public abstract getRate(): Promise<RATE_DATA>;

}

