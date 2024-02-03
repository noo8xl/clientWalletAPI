import { coinList } from './lib.helper/coinList'
import database from './database.service'
import ApiError from "../exceptions/apiError";
import Balance from './baseUsage/Balances'
import { TSX_DATA } from "../interfaces/transactionData.interface";
import Transaction from "./baseUsage/Transactions";
import Wallet from "./baseUsage/Wallets";
import {DEPOSIT_WALLET_PARAMS} from "../interfaces/depositWallet.interface";
import { ACCOUNT_WALLET, WALLET_DATA } from "../interfaces/Wallets.interface";


type CryptoServPayload = {
  coinName: string | null, 
  userId?: string, 
  address?: string
}

class CryptoService {
  private coinName: string
  private userId?: string
  private address?: string

  constructor(payload: CryptoServPayload) {
    this.coinName = payload.coinName
    this.userId = payload.userId
    this.address = payload.address
  }

  public async generateOneTimeAddressByCoinName(): Promise<string> {
    const dto = {
      coinName: this.coinName,
      userId: this.userId
    }

    const wt = new Wallet(dto)
    return await wt.CreateOneTimeAddress()
  }

  public async createUserWalletsList(): Promise<ACCOUNT_WALLET> {
    const dto = {
      coinName: this.coinName,
      userId: this.userId
    }

    const wt = new Wallet(dto)
    return await wt.CreateAccountWallets()
  }

  public async checkAddress(): Promise<boolean> {
    // this.coinName
    // this.address
    return true
  }

  public async getBalance(): Promise<number> {
    const init = new Balance(this.coinName, this.address)
    return await init.CheckBalance()
  }

  public async sendManualTransaction(txsInfo: TSX_DATA): Promise<boolean> {
    const init = new Transaction(txsInfo)
    return await init.sendTransaction()
  }

// ============================================================================================================= //
// ===================================== private area for internal usage only ================================== //
// ============================================================================================================= //

}

export default CryptoService;