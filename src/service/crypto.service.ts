import ApiError from "../exceptions/apiError";
import { TSX_DATA } from "../types/wallet/transactionData.interface";
import { BitcoinService } from './wallet/bitcoin.service';
import { WALLET_REQUEST_DTO, WALLET_TYPE } from 'src/types/wallet/wallet.types';
import { coinList } from '../crypto.lib/lib.helper/coinList'



export class CryptoService {
  private coinName: string
  private dto: WALLET_REQUEST_DTO; // for the new instance init 
  private wt: WALLET_TYPE;

  constructor(payload: WALLET_REQUEST_DTO) {
    this.coinName = payload.coinName
    this.dto = payload
  }

  // generateOneTimeAddressByCoinName -> generate address in chosen blockchain
  public async generateOneTimeAddressByCoinName(): Promise<string> {

    switch (this.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        return await this.wt.createWallet()
      // case coinList[1]:
      //   return await this.genWalletInEthereumNetwork()
      // case coinList[2]:
      //   return await this.genWalletInTronNetwork()
      // case coinList[3]:
      //   return await this.genWalletInTheOpenNetwork()
      default:
        throw await ApiError.BadRequest('unknown coin name at address gen')
    }
    
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

    switch (this.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        return await this.wt.getBalance()
      // case coinList[1]:
      //   return this.SendEthereumTransaction(transactionDetails)
      // case coinList[2]:
      //   return this.SendTronTransaction(transactionDetails)
      // case coinList[3]:
      //   return this.SendSolanaTransaction(transactionDetails)
      default:
        throw await ApiError.BadRequest()
    }
  }
  
  // sendManualTransaction -> send manual transaction with received data in chosen blockchain
  public async sendManualTransaction(): Promise<string> {



    switch (this.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(this.dto)
        return await this.wt.sendTransaction()
      // case coinList[1]:
      //   return this.SendEthereumTransaction(transactionDetails)
      // case coinList[2]:
      //   return this.SendTronTransaction(transactionDetails)
      // case coinList[3]:
      //   return this.SendSolanaTransaction(transactionDetails)
      default:
        throw await ApiError.BadRequest(`can't send transaction in unknown network or unavailable coin.`)
    }
  }

  // ============================================================================================================= //
  // ===================================== private area for internal usage only ================================== //
  // ============================================================================================================= //

}
