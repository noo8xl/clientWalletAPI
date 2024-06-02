import * as ethWallet from 'ethereumjs-wallet'
import Web3 from 'web3'
import {Wallet} from "./wallet.service";
import { RATE_DATA, WALLET, WALLET_REQUEST_DTO } from "../../types/wallet/wallet.types";
import { ETH_KEY } from '../../config/configs';
import axios from 'axios';
import { Helper } from '../../helpers/helper';
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from '../../exceptions/apiError';


export class EthereumService extends Wallet{
  coinName: string
  private readonly API_KEY: string = ETH_KEY
  private userId: string
  private address: string
  private helper: Helper 
  private dbService: WalletDatabaseService
  private status: boolean = true

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
    this.helper = new Helper()
    this.dbService = new WalletDatabaseService()
  }


  async createWallet(): Promise<boolean | string> {
    // https://levelup.gitconnected.com/generate-ethereum-address-using-node-js-a6a73f42a4cf
    const ethWt = ethWallet.default.generate();

    // console.log(`
    //   Generated wallet: 
    //   - address : ${wt.getAddressString()},
    //   - privKey : ${wt.getPrivateKeyString()},
    //   - pubKey : ${wt.getPublicKeyString()}
    // `);

    const wt: WALLET = {
      userId: this.userId,
      coinName: "Ethereum",
      address: ethWt.getAddressString(),
      privateKey:ethWt.getPrivateKeyString(),
      publicKey: ethWt.getPublicKeyString(),
      balance: 0,
    }

    this.status = await this.helper.validateObject(wt)
    this.status = await this.dbService.saveUserWallet(wt);
    if (!this.status) return false
    return wt.address
  }

  async getBalance(): Promise<number> {
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${this.API_KEY}`))
    const curAddress = web3.utils.toChecksumAddress(this.address)
    console.log('curAddress => ', curAddress);
    const tokenBalance = await web3.eth.getBalance(this.address)
    console.log('tokenBalance => ', tokenBalance);
    return Number(tokenBalance)
  }

  async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  async sendTransaction(): Promise<string> {
    let cryptoValToFiat: number
    // const rate: RATE_DATA = await this.getRate()
  
    // const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    //     `https://etherscan.io/address/${this.address}` 
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

  async getTransactionInfo(): Promise<any> {
    return ""
  }


  async getRate(): Promise<RATE_DATA | boolean> {
    let rateData: RATE_DATA;
    const coinNameForUrl: string = await this.helper.getCoinApiName(this.coinName)
    const fiatName: string = "" // await db get user details (fiat name )

    const getRateUrl: string = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`
    const balance: number = await this.getBalance()
    if (balance < 0) return false

    const d = await axios(getRateUrl)
    .then((res) => { return res.data })
    .catch((e) => {if (e) { this.status = false }})

    rateData = {
      coinName: this.coinName,
      fiatName: fiatName, 
      coinBalance: balance,
      fiatValue: d[coinNameForUrl][fiatName]
    }

    console.log("rate obj is -> ", rateData);
    if (!this.status) return false
    return rateData
  }

}