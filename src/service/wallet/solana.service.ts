
import solanaWeb3, { PublicKey } from '@solana/web3.js'
import { SOL_KEY } from "../../config/configs"
import { RATE_DATA, WALLET } from "src/types/wallet/wallet.types"
import {WALLET_REQUEST_DTO} from "../../dto/crypto/wallet.dto";
import crypto from "crypto"
import Web3 from '@solana/web3.js'
import { Wallet } from './walletInterface'

import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from "../../exceptions/Error.exception";
import {WalletHelper} from "./walletHelper";


export class SolanaService extends WalletHelper implements Wallet{

  readonly coinName: string
  private readonly API_KEY = SOL_KEY
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
      coinName: "solana",
      address: programAddressFromKey.toString(),
      privateKey: accountFromSecret.secretKey.toString(),
      publicKey: accountFromSecret.publicKey.toString(),
      balance: 0,
    }

    this.status = await this.dbService.saveUserWallet(wt);
		if (!this.status) throw ErrorInterceptor.ExpectationFailed("method caught an error.")
		return wt.address
  }

	public async getBalance(): Promise<number> {
    const apiUrl: string = `https://solana-mainnet.g.alchemy.com/v2/${this.API_KEY}/`
    const connection = new solanaWeb3.Connection(apiUrl, 'confirmed')
  
    const pubKey = new PublicKey(this.address)
    const balance: number = await connection.getBalance(pubKey)
    console.log('bal => ', balance / 100_000_000);
  
    const curBalance: number = balance / 100_000_000
    return Number(curBalance)
  }

	public async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

	public async sendTransaction(): Promise<string> {
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

	public async getTransactionInfo(): Promise<any> {
    
    return ""
  }

	public async getRate(): Promise<RATE_DATA> {
		const fiatName: string = "" // get from db by user data
		const balance: number = await this.getBalance()

		return await super.getRate(fiatName, balance)
	}

}