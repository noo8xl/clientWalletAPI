import TonWeb from "tonweb";
import { WalletContractV4 } from "ton";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import {Wallet} from "./wallet.service";
import { RATE_DATA, WALLET, WALLET_REQUEST_DTO } from "../../types/wallet/wallet.types";
import { getCoinApiName } from "src/crypto.lib/lib.helper/getCoinApiName";
import axios from "axios";



export class TheOpenNetworkService extends Wallet {
  coinName: string
  private userId: string
  private address: string

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
  }


  async createWallet(): Promise<string> {
    // https://github.com/toncenter/tonweb
    // https://ton-community.github.io/ton/

    let mnemonics = await mnemonicNew();
    let keyPair = await mnemonicToPrivateKey(mnemonics);

    // Create wallet contract
    let workchain: number = 0; // Usually you need a workchain 0
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    
    const wt: WALLET = {
      userId: this.userId,
      coinName: "TheOpenNetwork",
      address: String(wallet.address),
      privateKey: keyPair.secretKey,
      publicKey: keyPair.publicKey,
      balance: 0,
    }

    return wt.address
  }

  async getBalance(): Promise<number> {
    const tonWeb = new TonWeb()
    const balance = await tonWeb.getBalance(this.address)
    console.log('balance => ', balance);    
    return Number(balance)
  }

  async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  async sendTransaction(): Promise<string> {

    // https://ton-community.github.io/tutorials/01-wallet/ 

    const rate: RATE_DATA = await this.getRate()
  
    const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
    console.log('cryptoValToFiat => ', cryptoValToFiat);
    // const notifData: string = 
    //     `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
    //     `All transactions was sent! You can see detail here: \n ` + 
    // `https://tonscan.org/address/${this.address}` 
    if (cryptoValToFiat <= 50) {
      // // send 100% balance to owner if usd val < 50
      // await walletContract.sendTransfer({
      //   secretKey: this.keyData.privateKey, // addressFrom private key  < -
      //   seqno, messages: [
      //     internal({
      //       to: paymentArray[0].wallet, // wallet address
      //       value: String(paymentArray[0].wallet), // string | bigint
      //       body: "receive ton", // optional comment
      //       bounce: false,
      //     })
      //   ]})
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      //   .finally(() => {console.log("sending complete.");
      //   })
      // wait until confirmed
      // let currentSeqno = seqno;
      // while (currentSeqno == seqno) {
      //   console.log("waiting for transaction to confirm...");
      //   setTimeout(()=> {}, 1500);
      //   currentSeqno = await walletContract.getSeqno();
      // }
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

  async getRate(): Promise<RATE_DATA> {
    let rateData: RATE_DATA;
    const coinNameForUrl: string = await getCoinApiName(this.coinName)
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