
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types"
import ErrorInterceptor from "../../exceptions/apiError"

export abstract class Wallet {
  coinName: string

  constructor(coinName: string) { this.coinName = coinName }

  public abstract createWallet(): Promise<string | boolean>;
  public abstract getWallet(): Promise<WALLET>;
  public abstract getBalance(): Promise<number>;
  public abstract sendTransaction(): Promise<string | boolean>;
  public abstract getTransactionInfo(): Promise<any>;

  public abstract getRate(): Promise<RATE_DATA | boolean>;

}

