const TronWeb = require('tonweb')
import axios, { AxiosRequestHeaders } from 'axios';
import { TRON_API_KEY } from "../../config/configs";
import {Wallet} from "./walletInterface";
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types";
import {WALLET_REQUEST_DTO} from "../../dto/crypto/wallet.dto";
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from '../../exceptions/Error.exception';
import {WalletHelper} from "./walletHelper";

export class TronService extends WalletHelper implements Wallet{

	readonly coinName: string
  private readonly tronApiKey = TRON_API_KEY
  private readonly userId: string
  private readonly address: string

  private dbService: WalletDatabaseService
  private status: boolean = true

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
		this.dbService = new WalletDatabaseService()
  }

  public async createWallet(): Promise<string> {
    // https://www.npmjs.com/package/tronweb
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io/',
      headers: { "TRON-PRO-API-KEY": this.tronApiKey }
    })

    const trxAccount = await tronWeb.createAccount()

   //  console.log(`
   //    Generated wallet:
   //    - address : ${trxAccount.address.base58},
   //    - privKey : ${trxAccount.privateKey},
   //    - pubKey : ${trxAccount.publicKey}
   // `);

    const wt: WALLET = {
      userId: this.userId,
      coinName: "tron",
      address: trxAccount.address.base58.toString(),
      privateKey: trxAccount.privateKey,
      publicKey: trxAccount.publicKey,
      balance: 0,
    }

    this.status = await this.dbService.saveUserWallet(wt);
		if (!this.status) throw ErrorInterceptor.ExpectationFailed("method caught an error.")
    return wt.address
  }

  public async getBalance(): Promise<number> {
    const reqUrl: string = `https://apilist.tronscan.org/api/account?address=${this.address}`
    const payload = { "address": this.address }
    let trxNetworkCoinBalance: number;
    const coinData: any = await axios({
      method: 'GET',
      url: reqUrl,
      headers: payload
    })
			.catch((e) => {if (e) { this.status = false }})

		if (!this.status) throw ErrorInterceptor.ExpectationFailed("Can't get a balance.")

    console.log('coinData => ', coinData);
    const dataArray: any = coinData.data.tokens
    console.log('received data  => ', coinData.data.tokens);
    for (let i = 0; i < dataArray.length; i++) 
     trxNetworkCoinBalance = +dataArray[i].balance / 1_000_000

    return Number(trxNetworkCoinBalance)
  }

  public async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  public async sendTransaction(): Promise<string> {
    let cryptoValToFiat: number;
    // const rate: RATE_DATA = await this.getRate()
  
    // const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    // `https://tronscan.org/#/address/${this.address}` 
    if (cryptoValToFiat <= 50) {
      // send 100% balance to owner if usd val < 50
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
      // await send()  // from this.fromAddress to paymentArray[0].wallet
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      return ""
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return ""
    }
  }

  public async getTransactionInfo(): Promise<any> {
    return ""
  }

	public async getRate(): Promise<RATE_DATA> {
		const fiatName: string = "" // get from db by user data
		const balance: number = await this.getBalance()

		return await super.getRate(fiatName, balance)
	}


}