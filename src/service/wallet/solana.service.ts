
import solanaWeb3, { PublicKey } from '@solana/web3.js'
import { SOL_KEY } from "../../config/configs"
import { RATE_DATA, WALLET, WALLET_REQUEST_DTO } from "src/types/wallet/wallet.types"
import crypto from "crypto"
import Web3 from '@solana/web3.js'
import { Wallet } from './wallet.service'
import axios from 'axios'
import { Helper } from '../../helpers/helper'
import { WalletDatabaseService } from "../database/wallet.db.service"


export class SolanaService extends Wallet {
  coinName: string
  private readonly API_KEY = SOL_KEY
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
    // https://docs.solana.com/developing/clients/javascript-reference
    let account = Web3.Keypair.generate();

    // Create a Program Address
    let highEntropyBuffer = crypto.randomBytes(31);
    let accountFromSecret = Web3.Keypair.fromSecretKey(account.secretKey);

    let base58publicKey: any = accountFromSecret.publicKey
    let programAddressFromKey = await Web3.PublicKey.createProgramAddress(
      [highEntropyBuffer.slice(0, 31)],
      base58publicKey,
    );
 
  //   console.log(`
  //     Generated wallet: 
  //     - address: ${programAddressFromKey},
  //     - privKey : ${accountFromSecret.secretKey},
  //     - pubKey : ${accountFromSecret.publicKey}
  //  `);

    const wt: WALLET = {
      userId: this.userId,
      coinName: "Solana",
      address: programAddressFromKey.toString(),
      privateKey: accountFromSecret.secretKey.toString(),
      publicKey: accountFromSecret.publicKey.toString(),
      balance: 0,
    }

    this.status = await this.helper.validateObject(wt)
    this.status = await this.dbService.saveUserWallet(wt);
    if (!this.status) return false
    return wt.address
  }

  async getBalance(): Promise<number> {
    const apiUrl: string = `https://solana-mainnet.g.alchemy.com/v2/${this.API_KEY}/`
    const connection = new solanaWeb3.Connection(apiUrl, 'confirmed')
  
    const pubKey = new PublicKey(this.address)
    const balance: number = await connection.getBalance(pubKey)
    console.log('bal => ', balance / 100_000_000);
  
    const curBalance: number = balance / 100_000_000
    return Number(curBalance)
  }

  async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  async sendTransaction(): Promise<string> {
    let cryptoValToFiat: number
    // const rate: RATE_DATA | boolean = await this.getRate()

    // const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    // `https://solscan.io/account/${this.address}` 
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
    const coinNameForUrl: string = await this.helper.getCoinApiName(this.coinName)
    const fiatName: string = "" // await db get user details (fiat name )

    const getRateUrl: string = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`
    const balance: number = await this.getBalance()
    if(balance < 0) return false

    const d = await axios(getRateUrl)
    .then((res) => { return res.data })
    .catch((e) => {if (e) { this.status = false }})

    const rateData: RATE_DATA = {
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