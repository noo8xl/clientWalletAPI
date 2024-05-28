
import { coinList } from "../../config/configs";
import ErrorInterceptor  from "../../exceptions/apiError";
import { BitcoinService } from '../wallet/bitcoin.service';
import { EthereumService } from "../wallet/ethereum.service";
import { TronService } from "../wallet/tron.service";
import { TheOpenNetworkService } from "../wallet/theOpenNetwork.service";
import { SolanaService } from "../wallet/solana.service";

import { WALLET_REQUEST_DTO, WALLET_TYPE } from '../../types/wallet/wallet.types';

// CryptoService -> CRUD interaction with different blockchains 
export class CryptoService {
  private wt: WALLET_TYPE;

  constructor() {}

  // generateOneTimeAddressByCoinName -> generate address in chosen blockchain
  public async generateOneTimeAddressByCoinName(payload: WALLET_REQUEST_DTO): Promise<string> {
    await this.setWalletInstance(payload)
    return await this.wt.createWallet()
  }

  // getBalance -> get wallet balance by address in chosen blockchain
  public async getBalance(payload: WALLET_REQUEST_DTO): Promise<number> {
    await this.setWalletInstance(payload)
    return await this.wt.getBalance()
  }
  
  // sendManualTransaction -> send manual transaction with received data in chosen blockchain
  public async sendManualTransaction(payload: WALLET_REQUEST_DTO): Promise<string> {
    await this.setWalletInstance(payload)
    return await this.wt.sendTransaction()
  }

  // ============================================================================================================= //
  // ===================================== private area for internal usage only ================================== //
  // ============================================================================================================= //

  // setWalletInstance -> set wallet instance depends on requested coinName
  private async setWalletInstance(payload: WALLET_REQUEST_DTO): Promise<void> {

    switch (payload.coinName) {
      case coinList[0]:
        this.wt = new BitcoinService(payload)
        break;
      case coinList[1]:
        this.wt = new EthereumService(payload)
        break;
      case coinList[2]:
        this.wt = new TronService(payload)
        break;
      case coinList[3]:
        this.wt = new TheOpenNetworkService(payload)
        break;
      case coinList[4]:
        this.wt = new SolanaService(payload)
        break;
      default:
        throw await ErrorInterceptor.BadRequest(`Can't send transaction in unknown ${payload.coinName} network or unavailable coin.`)
    }
  }

}
