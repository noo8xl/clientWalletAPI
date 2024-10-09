
import { coinList } from "../../config/configs";

import { BitcoinService } from '../wallet/bitcoin.service';
import { EthereumService } from "../wallet/ethereum.service";
import { TronService } from "../wallet/tron.service";
import { TheOpenNetworkService } from "../wallet/theOpenNetwork.service";
import { CacheService } from "../cache/cache.service";
import { SolanaService } from "../wallet/solana.service";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { NotificationService } from "../notification/notification.service";

import ErrorInterceptor from "../../exceptions/Error.exception";

import { WALLET_REQUEST_DTO } from "../../dto/crypto/wallet.dto";
import { WALLET_TYPE } from '../../types/wallet/wallet.types';
import { Customer } from "../../entity/customer/Customer";


// CryptoService -> CRUD interaction with different blockchains 
class CryptoService {
  private wt: WALLET_TYPE;
  private readonly cacheService: CacheService
  private readonly notificator: NotificationService
  private readonly customerDb: CustomerDatabaseService

  constructor() {
    this.cacheService = new CacheService()
    this.notificator = new NotificationService()
    this.customerDb = new CustomerDatabaseService()
  }

  // generateOneTimeAddressByCoinName -> generate address in the chosen blockchain
  public async generateOneTimeAddressByCoinName(payload: WALLET_REQUEST_DTO): Promise<string> {
    await this.setWalletInstance(payload)
    return await this.wt.createWallet()
  }

  // getBalance -> get wallet balance by address in the chosen blockchain
  public async getBalance(payload: WALLET_REQUEST_DTO): Promise<number> {
    await this.setWalletInstance(payload)
    return await this.wt.getBalance()
  }
  
  // sendManualTransaction -> send manual transaction with received data in the chosen blockchain
  public async sendManualTransaction(payload: WALLET_REQUEST_DTO): Promise<string> {

		let hash: string;

		const msg: string = `
      You should approve <send transaction> action.
      To approve tsx -> send "Y"
      To reject tsx -> send "N"
      `;
		let customer: Customer = await this.customerDb.findUserByFilter({id: payload.userId})
		await this.notificator.sendInfoTelegramMessage(customer.getTelegramId(), msg)
		// set cache here ->
		await this.cacheService.setManualTransactionCacheData()
		return hash;
  }

	// sendTransactionAutomatically -> send transaction automatically if balance was found
	public async sendTransactionAutomatically(payload: WALLET_REQUEST_DTO): Promise<void> {
    const chatId = 0 //  await this.customerDb.getCustomerChatId()
    const msg = "";

    await this.setWalletInstance(payload)
		await this.wt.sendTransaction()
    await this.notificator.sendInfoTelegramMessage(chatId, msg)
	}

	public async approveTransaction(): Promise<string> {
		// get tsx from cache if available <-
		let userId: string = ''
		const c: any  = await this.cacheService.getManualTransactionCachedData(userId)
		if (!c) throw ErrorInterceptor.NotFoundError()
		let payload: WALLET_REQUEST_DTO = {
			userId: c.userId,
      coinName: c.coinName,
			address: c.addressFrom,
		}
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
        // console.log(`list[0] = ${coinList[0]} coinName: ${payload.coinName}`);
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
        throw ErrorInterceptor.ExpectationFailed("Received wrong coin name.")
    }
  }
}

export default new CryptoService()
