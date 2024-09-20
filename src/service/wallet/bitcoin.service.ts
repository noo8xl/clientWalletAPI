import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
// import bchaddr from 'bchaddrjs'

import {Wallet} from "./walletInterface";
import { RATE_DATA, WALLET } from '../../types/wallet/wallet.types';
import {WALLET_REQUEST_DTO} from "../../dto/crypto/wallet.dto";
import axios from 'axios';
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from "../../exceptions/Error.exception";
import {WalletHelper} from "./walletHelper";
import {TelegramNotificationApi} from "../../api/notification.api";

// BitcoinService -> implements btc blockchain manipulation
export class BitcoinService extends WalletHelper implements Wallet {

  readonly coinName: string
  private readonly userId: string
  private readonly address: string
  private dbService: WalletDatabaseService
	private readonly notification: TelegramNotificationApi;

  constructor(dto: WALLET_REQUEST_DTO) {
		super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
		this.dbService = new WalletDatabaseService()
		this.notification = new TelegramNotificationApi()
  }


  public async createWallet(): Promise<string> {
    // https://javascript.plainenglish.io/generate-your-own-bitcoin-wallet-within-5-minutes-3c36176b47ee?gi=c00ebff5e60f
    // https://github.com/bitpay/bitcore/tree/master/packages/bitcore-lib
    // https://github.com/BitGo/BitGoJS/tree/master/modules/utxo-lib

    const network = bitcoin.networks.bitcoin
    // use 'm/44'/1'/0'/0 for testnet
    const path = `m/44'/1'/0'/0` 

    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const root = bip32.fromSeed(seed, network)

    const account = root.derivePath(path)
    const node = account.derive(0).derive(0)

    const btcAddress = bitcoin.payments.p2pkh({
      pubkey: node.publicKey,
      network: network
    }).address
    

    // https://www.npmjs.com/package/bchaddrjs
    // const bchAddress = bchaddr.toCashAddress(btcAddress).split(':')[1]

    const wt: WALLET = {
      userId:  this.userId,
      coinName: "bitcoin",
      address: btcAddress,
      privateKey: node.privateKey.toString(),
      publicKey: node.publicKey.toString(),
      seedPhrase: seed.toString(),
      mnemonic: node.toWIF(),
      balance: 0,
    }

    // const bchObject: WALLET = {
    //   coinName: 'BCH',
    //   address: bchAddress,
    //   privateKey: node.toWIF(),
    //   seed: mnemonic,
    //   publicKey: '',
    // }\

    // console.log(`
    //   Generated data is:
    //   - bch address : ${bchAddress}
    //   - btc obj: ${wt},
    // `);

		try {
			await this.dbService.saveUserWallet(wt)
		} catch (e) {
			throw ErrorInterceptor.ExpectationFailed("Create wallet caught an error.")
		}
    return wt.address
  }

  public async getBalance(): Promise<number> {
		let balance: number;
    const coinData: any = await axios(`https://blockchain.info/balance?active=${this.address}`)
      .then((res) => { return { balanceData: res.data, status: res.status }})
      .catch((e) => { throw ErrorInterceptor.ExpectationFailed(`Can't get balance. Caught an error ${e.message}`)} )

    // console.log('coinData => ', coinData);
		const keysList: any = Object.keys(coinData.balanceData)
    for (let i = 0; i < keysList.length - 1; i++) {
      if (keysList[i] === this.address) {
        balance = keysList[0].final_balance
        break;
      }
    }

		console.log('received balance: ', balance);
    return Number(balance)
  }

  public async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  public async getTransactionInfo(): Promise<any> {
    return ""
  }

	// sendTransaction -> returns transaction hash str
  public async sendTransaction(): Promise<string> {
    let cryptoValToFiat: number
    // const rate: RATE_DATA = await this.getRate()
  
    // const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    // `https://www.blockchain.com/ru/explorer/addresses/btc/${this.address}` 
    if (cryptoValToFiat <= 50) {
      // send 100% balance to owner if usd val < 50
			//
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
			// 	.then(async () => await super.send() ) // from this.fromAddress to paymentArray[0].wallet)
      //   .then(async () => await this.notification.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData))
      //   .then(async () => await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) )
      //   .catch(console.error)

      return ""
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return ""
    }
  }

	public async getRate(): Promise<RATE_DATA> {
		const fiatName: string = "" // get from db by user data
		const balance: number = await this.getBalance()

		return await super.getRate(fiatName, balance)
	}


}