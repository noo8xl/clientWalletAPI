import cryptoService from "../crypto/crypto.service"
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from "src/exceptions/apiError"

import { WALLET } from "../../types/wallet/wallet.types"

// https://www.geeksforgeeks.org/how-to-handle-child-threads-in-node-js/


type wtBalanceStruct = {
  coinName: string
  address: string
  balance: number
}

export class BalanceParser {
  private coinName: string
  private stamp: number
  private fromStamp: number
  private wtList: WALLET[]
  private balances: wtBalanceStruct[]
  private databaseService: WalletDatabaseService


  constructor(coinName: string){
    this.coinName = coinName
    this.databaseService = new WalletDatabaseService()
  }

  // setParams -> set dates range
  async setParams(): Promise<void> {
    this.stamp = new Date().getTime()
    this.fromStamp = this.stamp - (1000 * 60 * 60 * 48)
  }

  // getWalletListByParams -> get wallets from database by setted params
  async getWalletListByParams(): Promise<void> {
    let walletList: any = await this.databaseService.getWalletList(this.coinName, this.fromStamp)
    if(!walletList) return
    if(!walletList.length) {
      console.log("empty set. wallet list len is -> ", walletList.length);
      return
    }
    this.wtList = walletList
  }

  // getWalletBalances -> get balances, update wallet statuses and push balances in <this.balances> array
  async getWalletBalances(): Promise<void> {
    balanceSeeker: for (let i = 0; i <= this.wtList.length -1; i++) {
      let balance: number = await cryptoService.getBalance({coinName: this.coinName, address: this.wtList[i].address})
      if(balance < 0) 
        throw await ErrorInterceptor.ServerError(`
          getWalletBalances was failed. The wallet is: 
          coinName: ${this.coinName}, 
          address: ${this.wtList[i].address}`
        )
      if(balance = 0) await this.databaseService.updateWalletStatus(this.wtList[i].address, false, true)
      if(balance > 0) {
        this.balances.push({coinName: this.coinName, address: this.wtList[i].address, balance: balance})
        // await this.databaseService.updateWalletStatus(this.) // -> update balance data in tables & update updatedAt
        await this.databaseService.updateWalletStatus(this.wtList[i].address, true, true)
      }
      continue balanceSeeker;
    }
  }

  // getCoinsFromWallet -> run through the <this.balances> and call <sendTransaction> here to send the coins from wallet to owner 
  async getCoinsFromWallet(): Promise<void> {
    console.log("balance array length is -> ", this.balances.length);
    let result: string | boolean = await cryptoService.sendManualTransaction({coinName: this.coinName, address: this.balances[0].address})
    if(!result) 
      throw await ErrorInterceptor.ServerError(`
        getCoinsFromWallet was failed. The wallet is: 
        coinName: ${this.balances[0].coinName}, 
        address: ${this.balances[0].address}`
      )
      
    this.balances.shift()
    await this.getCoinsFromWallet()
  }
}