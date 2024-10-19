import {Wallet} from "./walletInterface";
import {CmdExecutor} from "./cmdExecutor";
import { CustomerDatabaseService } from "../database/customer.db.service";

import { Customer } from "src/entity/customer/Customer";

import { WALLET } from "../../types/wallet/wallet.types";
import {WALLET_REQUEST_DTO} from "../../dto/crypto/wallet.dto";


export class EthereumService extends CmdExecutor implements Wallet {

  readonly coinName: string
  private readonly userId: string
  private readonly address: string

	private readonly customerDb: CustomerDatabaseService

  constructor(dto: WALLET_REQUEST_DTO) {
		super(dto.coinName)

    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
		this.customerDb = new CustomerDatabaseService()
  }


  // generate new wallet 
  public async createWallet(): Promise<string> {
    return await this.createAddressCmd( ['gwlt', 'btc', this.userId] )
  }

  // get wallet balance
  public async getBalance(): Promise<any> {
    const customer: Customer = await this.customerDb.findUserByFilter({_id: this.userId})
    let fiatName: string = customer.getFiatName().toString()
    return await this.getBalanceCmd( [this.coinName, this.address, fiatName] )
  }

  // get wallet details (statistics, etc)
  public async getWallet(): Promise<WALLET> {
    return await this.getWalletDetailsCmd( [this.coinName, this.address] )
  }

  // get transaction details (get transaction hash with all details)
  public async getTransactionInfo(): Promise<any> {
    return await this.getTransactionDetailsCmd( [''] )
  }

  // send transaction from - to  (amount)
  public async sendTransaction(): Promise<string> {
    return await this.sendTransactionCmd( [this.coinName, this.address, 'addressTo', 'integer amount'] )
  }

}