
import { coinList } from "../config/configs";
import ApiError from "../exceptions/apiError";
import { BitcoinService } from './wallet/bitcoin.service';
import { WALLET_REQUEST_DTO, WALLET_TYPE } from '../types/wallet/wallet.types';
import { EthereumService } from "./wallet/ethereum.service";
import { TronService } from "./wallet/tron.service";
import { TheOpenNetworkService } from "./wallet/theOpenNetwork.service";
import { SolanaService } from "./wallet/solana.service";


export class CryptoService {
  private dto: WALLET_REQUEST_DTO; // for the new service instance init 
  private wt: WALLET_TYPE;

  constructor(payload: WALLET_REQUEST_DTO) {
    this.dto = payload
  }

  // generateOneTimeAddressByCoinName -> generate address in chosen blockchain
  public async generateOneTimeAddressByCoinName(): Promise<string> {

    switch (this.dto.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        break;
      case coinList[1]:
        this.wt = new EthereumService(this.dto)
        break;
      case coinList[2]:
        this.wt = new TronService(this.dto)
        break;
      case coinList[3]:
        this.wt = new TheOpenNetworkService(this.dto)
        break;
      case coinList[4]:
        this.wt = new SolanaService(this.dto)
        break;
      default:
        throw await ApiError.BadRequest('unknown coin name at address gen')
    }

    return await this.wt.createWallet()
  }

  // createUserWalletsList -> create wallet for current user in each available blockchain
  // public async createUserWalletsList(): Promise<ACCOUNT_WALLET> {
  //   const wt = new Wallet(dto)
  //   return await wt.CreateAccountWallets()
  // }


  // checkAddress -> check if address is available 
  // public async checkAddress(): Promise<boolean> {}

  // getBalance -> get wallet balance by  address in chosen blockchain
  public async getBalance(): Promise<number> {

    switch (this.dto.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        break;
      case coinList[1]:
        this.wt = new EthereumService(this.dto)
        break;
      case coinList[2]:
        this.wt = new TronService(this.dto)
        break;
      case coinList[3]:
        this.wt = new TheOpenNetworkService(this.dto)
        break;
      default:
        throw await ApiError.BadRequest('recieved unknown coin name or address')
    }

    return await this.wt.getBalance()
  }
  
  // sendManualTransaction -> send manual transaction with received data in chosen blockchain
  public async sendManualTransaction(): Promise<string> {

    switch (this.dto.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        break;
      case coinList[1]:
        this.wt = new EthereumService(this.dto)
        break;
      case coinList[2]:
        this.wt = new TronService(this.dto)
        break;
      case coinList[3]:
        this.wt = new TheOpenNetworkService(this.dto)
        break;
      default:
        throw await ApiError.BadRequest(`can't send transaction in unknown network or unavailable coin.`)
    }

    return await this.wt.sendTransaction()
  }

  // ============================================================================================================= //
  // ===================================== private area for internal usage only ================================== //
  // ============================================================================================================= //

}