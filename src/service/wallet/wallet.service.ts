import { WALLET_REQUEST_DTO } from "src/dto/crypto/wallet.dto"
import { CustomerDatabaseService } from "../database/customer.db.service"
import { CmdExecutor } from "./cmdExecutor"

export class WalletService extends CmdExecutor {

  readonly coinName: string
  private readonly userId: string
  private readonly address: string
  private readonly addressTo: string
  private readonly amountInCrypto: number

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
    return await this.createAddressCmd( ['gwlt', this.coinName, this.userId] )
  }

  // get wallet balance
  public async getBalance(): Promise<any> {
    // const customer: Customer = await this.customerDb.findUserByFilter({_id: this.userId})
    // let fiatName: string = customer.getFiatName().toString()

    let fiatName: string = 'usd' // placeholder
    return await this.getBalanceCmd( ["gb", this.coinName, this.address, fiatName] )
  }

  // send transaction from - to  (amount)
  public async sendTransaction(): Promise<string> {
    return await this.sendTransactionCmd( [this.coinName, this.address, this.addressTo, this.amountInCrypto.toString()] )
  }

  // ###################################################################################################

  // // get wallet details (statistics, etc)
  // public async getWallet(): Promise<GET_WALLET_DETAILS_DTO> {
  //   return await this.getWalletDetailsCmd([this.coinName, this.address])
  // }

  // // get transaction details (hash from db ?)
  // public async getTransactionInfo(): Promise<any> {
  //   return await this.getTransactionDetailsCmd( [''] )
  // }


}