import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import bchaddr from 'bchaddrjs'

import {Wallet} from "./wallet.service";
import { RATE_DATA, WALLET, WALLET_REQUEST_DTO } from '../../types/wallet/wallet.types';
import axios from 'axios';
import { Helper } from '../../helpers/helper';


// BitcoinService -> implements btc blockchain manipulation
export class BitcoinService extends Wallet {
  coinName: string
  private userId: string
  private address: string
  private readonly helper: Helper = new Helper()

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
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
    const bchAddress = bchaddr.toCashAddress(btcAddress).split(':')[1]

    const wt: WALLET = {
      userId:  this.userId,
      coinName: "Bitcoin",
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

    console.log(`
      Generated data is:
      - bch address : ${bchAddress}
      - btc obj: ${wt},
    `);
    
    // await database.saveWallet(wt);

    return wt.address
  }

  public async getBalance(): Promise<number> {

    const coinData: any = await axios(`https://blockchain.info/balance?active=${this.address}`)
      .then((res) => { return { balanceData: res.data, status: res.status }})
      .catch((e) => {if (e) { throw new Error(e) }})

    console.log('coinData => ', coinData);
    
    const some: any = Object.keys(coinData.balanceData)
    let balance: number;
    for (let i = 0; i < some.length - 1; i++) {
      if (some[i] === this.address) {
        balance = some[0].final_balance
        break;
      }
      continue;
    }

    console.log('received balance: ', balance);
    return Number(balance)
  }

  async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  async getTransactionInfo(): Promise<any> {
    return ""
  }

  public async sendTransaction(): Promise<string> {
    const rate: RATE_DATA = await this.getRate()
  
    const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    // `https://www.blockchain.com/ru/explorer/addresses/btc/${this.address}` 
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

  public async getRate(): Promise<RATE_DATA> {
    let rateData: RATE_DATA;
    const coinNameForUrl: string = await this.helper.getCoinApiName(this.coinName)
    const fiatName: string = "" // await db get user details (fiat name )

    const getRateUrl: string = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`
    const balance: number = await this.getBalance()

    const d = await axios(getRateUrl)
    .then((res) => { return res.data })
    .catch((e) => {if (e) { throw new Error(e) }})

    rateData = {
      coinName: this.coinName,
      fiatName: fiatName, 
      coinBalance: balance,
      fiatValue: d[coinNameForUrl][fiatName]
    }

    console.log("rate obj is -> ", rateData);
    
    return rateData
  }

}