
import { WalletContractV4, TonClient, Address } from "@ton/ton";
import { mnemonicNew , KeyPair, mnemonicToWalletKey } from "ton-crypto";
import {Wallet} from "./walletInterface";
import { RATE_DATA, WALLET, WALLET_REQUEST_DTO } from "../../types/wallet/wallet.types";
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from '../../exceptions/Error.exception';
import {WalletHelper} from "./walletHelper";


export class TheOpenNetworkService extends WalletHelper implements Wallet {

  readonly coinName: string
  private readonly userId: string
  private readonly address: string

  private client: TonClient
  private dbService: WalletDatabaseService
  private status: boolean = true

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
    this.dbService = new WalletDatabaseService()

    this.client = new TonClient({endpoint: "testnet"})
    // this.client = new TonClient({endpoint: "mainnet"})
  }


  public async createWallet(): Promise<string> {
    // https://ton-community.github.io/tutorials/01-wallet/ 
    const mnemonics: string[] = await mnemonicNew();
    const keyPair: KeyPair = await mnemonicToWalletKey(mnemonics);

    // Create wallet contract
    let workchain: number = 0; // Usually you need a workchain 0
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    
    const wt: WALLET = {
      userId: this.userId,
      coinName: "theOpenNetwork",
      address: wallet.address.toString(),
      privateKey: keyPair.secretKey.toString(),
      publicKey: keyPair.publicKey.toString(),
      balance: 0,
    }

    this.status = await this.dbService.saveUserWallet(wt);
		if (!this.status) throw await ErrorInterceptor.ExpectationFailed("method caught an error.")
    return wt.address
  }

  public async getBalance(): Promise<number> {
    const balance: bigint = await this.client.getBalance(Address.parse(this.address))
    console.log('balance => ', balance);    
    return Number(balance)
  }

  public async getWallet(): Promise<WALLET> {
    let wt: WALLET;
    return wt;
  }

  public async sendTransaction(): Promise<string> {
    let cryptoValToFiat: number
    // const rate: RATE_DATA = await this.getRate()
    // const cryptoValToFiat: number = rate.fiatValue * rate.coinBalance
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

	public async getRate(): Promise<RATE_DATA> {
		const fiatName: string = "" // get from db by user data
		const balance: number = await this.getBalance()

		return await super.getRate(fiatName, balance)
	}

}