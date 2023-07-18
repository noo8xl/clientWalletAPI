
import axios from 'axios'
import Web3 from 'web3'
import solanaWeb3, { PublicKey } from '@solana/web3.js'
import { coinList } from '../lib.helper/coinList'
import ApiError from '../../exceptions/apiError';
import TonWeb from 'tonweb';

export default class Balance {
  coinName:string
  address: string
  private readonly ETH_KEY: string | undefined = process.env.ETH_API_KEY
  private readonly SOL_KEY: string | undefined = process.env.SOLANA_API_KEY

  constructor(coinName:string, address: string) {
    this.coinName = coinName
    this.address = address
  }

  public async CheckBalance(): Promise<number> {

    switch (this.coinName) {
      case coinList[0]:
      // case coinList[1]:// can't check bch balance. should fix it later <------------------------------------------------
        return this.getBtcNetworkBalance()
      case coinList[2]:
      case coinList[3]:
        return this.getEthereumNetworkBalance()
      case coinList[4]:
      case coinList[5]:
        return this.getTronNetworkBalance()
      case coinList[6]:
        return this.getSolanaNetworkBalance()
      case coinList[7]:
        return this.getTheOpenNetworkBalance()
      default:
        throw await ApiError.BadRequest()
    }
  }


// ============================================================================================================= //
// ================================== protected methods for internal usage only ================================ //
// ============================================================================================================= //

  protected async getBtcNetworkBalance(): Promise<number> {

    const coinData: any = await axios(`https://blockchain.info/balance?active=${this.address}`)
      .then((res) => { return { balanceData: res.data, status: res.status }})
      .catch((e) => {if (e) { throw new Error(e) }})

    console.log('coinData => ', coinData);
    
    const some: any = Object.keys(coinData.balanceData)
    let balance: number = 0
    getBalanceData: for (let i = 0; i < some.length - 1; i++) {
      if (some[i] === this.address) {
        balance = some[0].final_balance
        break getBalanceData;
      }
      continue getBalanceData;
    }
    console.log('received balance: ', balance);
    return Number(balance)
  }

  protected async getEthereumNetworkBalance(): Promise<number> {

    const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${this.ETH_KEY}`))
    const curAddress = web3.utils.toChecksumAddress(this.address)
    console.log('curAddress => ', curAddress);
    const tokenBalance = await web3.eth.getBalance(this.address)
    console.log('tokenBalance => ', tokenBalance);
    return Number(tokenBalance)
  }

  protected async getTronNetworkBalance(): Promise<number> {

    const reqUrl: string = `https://apilist.tronscan.org/api/account?address=${this.address}`
    const payload: any = { "address": this.address }
    const coinData: any = await axios({
      method: 'GET',
      url: reqUrl,
      headers: payload
    })
    console.log('coinData => ', coinData);
    const dataArray: any = coinData.data.tokens
    let trxNetworkCoinBalance: number;
    console.log('received data  => ', coinData.data.tokens);
    for (let i = 0; i < dataArray.length; i++) 
     trxNetworkCoinBalance = +dataArray[i].balance / 1_000_000

    return Number(trxNetworkCoinBalance)
  }

  protected async getSolanaNetworkBalance(): Promise<number> {

    const apiUrl: string = `https://solana-mainnet.g.alchemy.com/v2/${this.SOL_KEY}/`
    const connection = new solanaWeb3.Connection(apiUrl, 'confirmed')
  
    const pubKey = new PublicKey(this.address)
    const balance: number = await connection.getBalance(pubKey)
    console.log('bal => ', balance / 100_000_000);
  
    const curBalance: number = balance / 100_000_000
    return Number(curBalance)
  }

  protected async getTheOpenNetworkBalance(): Promise<number> {
    const tonWeb = new TonWeb()
    const balance = await tonWeb.getBalance(this.address)
    console.log('balance => ', balance);    
    return Number(balance)
  }
  
}
