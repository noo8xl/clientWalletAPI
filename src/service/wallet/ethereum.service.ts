import * as ethWallet from 'ethereumjs-wallet'
import Web3 from 'web3'
import {Wallet} from "./walletInterface";
import { RATE_DATA, WALLET } from "../../types/wallet/wallet.types";
import {WALLET_REQUEST_DTO} from "../../dto/crypto/wallet.dto";
import { ETH_KEY } from '../../config/configs';
import { WalletDatabaseService } from "../database/wallet.db.service"
import ErrorInterceptor from '../../exceptions/Error.exception';
import {WalletHelper} from "./walletHelper";


export class EthereumService extends WalletHelper implements Wallet {

	readonly coinName: string
	private readonly API_KEY: string = ETH_KEY
  private readonly userId: string
  private readonly address: string

  private readonly dbService: WalletDatabaseService
  private status: boolean = true

  constructor(dto: WALLET_REQUEST_DTO) {
		super(dto.coinName)
    this.userId = dto.userId
    this.coinName = dto.coinName
    this.address = dto.address
		this.dbService = new WalletDatabaseService()
  }


  public async createWallet(): Promise<string> {
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
      coinName: "ethereum",
      address: ethWt.getAddressString(),
      privateKey:ethWt.getPrivateKeyString(),
      publicKey: ethWt.getPublicKeyString(),
      balance: 0,
    }

		this.status = await this.dbService.saveUserWallet(wt);
		if (!this.status) throw ErrorInterceptor.ExpectationFailed("Wallet saving was failed.")
		return wt.address
  }

  public async getBalance(): Promise<number> {
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${this.API_KEY}`))
    const curAddress = web3.utils.toChecksumAddress(this.address)
    console.log('curAddress => ', curAddress);
    const tokenBalance = await web3.eth.getBalance(this.address)
    console.log('tokenBalance => ', tokenBalance);
    return Number(tokenBalance)
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

  public async getTransactionInfo(): Promise<any> {
    return ""
  }

	public async getRate(): Promise<RATE_DATA> {
		const fiatName: string = "" // get from db by user data
		const balance: number = await this.getBalance()

		return await super.getRate(fiatName, balance)
	}

}