import { CacheService } from "../cache/cache.service";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { NotificationService } from "../notification/notification.service";
import { WalletService } from "../wallet/wallet.service";

import ErrorInterceptor from "../../exceptions/Error.exception";

import { GET_BALANCE_DTO, WALLET_ITEM_RESPONSE, WALLET_REQUEST_DTO } from "../../dto/crypto/wallet.dto";
import { coinList } from "../../config/configs";

// CryptoService -> CRUD interaction with different blockchains
class CryptoService {
  private wt: WalletService;
  private readonly cacheService: CacheService;
  private readonly notificator: NotificationService;
  private readonly customerDb: CustomerDatabaseService;

  constructor() {
    this.cacheService = new CacheService();
    this.notificator = new NotificationService();
    this.customerDb = new CustomerDatabaseService();
  }

  // generateOneTimeAddressByCoinName -> generate address in the chosen blockchain
  public async generateOneTimeAddressByCoinName(payload: WALLET_REQUEST_DTO): Promise<string> {
    await this.initService(payload);
    return await this.wt.createOneTimeAddress();
  }

  // createWallet -> generate wallet in each blockchain
  public async createWallet(userId: string): Promise<WALLET_ITEM_RESPONSE[]> {
    let payload: WALLET_REQUEST_DTO = { coinName: "create", userId: userId };
    await this.initService(payload);
    return await this.wt.createWallet();
  }

  // getBalance -> get wallet balance by address in the chosen blockchain
  public async getBalance(payload: WALLET_REQUEST_DTO): Promise<GET_BALANCE_DTO> {
    await this.initService(payload);
    return await this.wt.getBalance();
  }

  // sendManualTransaction -> send manual transaction with received data in the chosen blockchain
  public async sendManualTransaction(payload: WALLET_REQUEST_DTO): Promise<void> {
    let msg: string = `
      You should approve <send transaction> action.
      To approve tsx -> send "Y"
      To reject tsx -> send "N"
      `;

    try {
      const chatId: number = await this.customerDb.getCustomerChatId(payload.userId);

      await this.notificator.sendMessageViaTelegram(msg, chatId);
      await this.cacheService.setTsxCache(payload.userId, payload);
    } catch (e: any) {
      throw ErrorInterceptor.ExpectationFailed(e.message);
    }
  }

  // sendTransactionAutomatically -> send transaction automatically if balance was found
  public async sendTransactionAutomatically(payload: WALLET_REQUEST_DTO): Promise<string> {
    let hash: string;
    let msg = "ur msg will be here";

    try {
      const chatId: number = await this.customerDb.getCustomerChatId(payload.userId);

      await this.initService(payload);
      await this.wt.sendTransaction();
      await this.notificator.sendMessageViaTelegram(msg, chatId);

      return hash;
    } catch (e: any) {
      throw ErrorInterceptor.ExpectationFailed(e.message);
    }
  }

  public async approveTransaction(): Promise<string> {
    // get tsx from cache if available <-
    let userId: string = "";
    const c: WALLET_REQUEST_DTO = await this.cacheService.getTsxCache(userId);
    if (!c) throw ErrorInterceptor.NotFoundError();

    await this.initService(c);
    return await this.wt.sendTransaction();
  }

  // ============================================================================================================= //
  // ===================================== private area for internal usage only ================================== //
  // ============================================================================================================= //

  private async initService(payload: WALLET_REQUEST_DTO): Promise<void> {
    this.validateCoinName(payload.coinName);
    this.wt = new WalletService(payload);
  }

  private validateCoinName(coin: string): void {
    if (coin === "create") return;

    for (let i = 0; i < coinList.length; i++) if (coin === coinList[i]) return;
    ErrorInterceptor.BadRequest("got wrong coin name");
  }

  // // setWalletInstance -> set wallet instance depends on recieved coinName
  // private async setWalletInstance(payload: WALLET_REQUEST_DTO): Promise<void> {
  //   switch (payload.coinName) {
  //     case coinList[0]:
  //       // console.log(`list[0] = ${coinList[0]} coinName: ${payload.coinName}`);
  //       this.wt = new BitcoinService(payload)
  //       break;
  //     case coinList[1]:
  //       this.wt = new EthereumService(payload)
  //       break;
  //     case coinList[2]:
  //       this.wt = new TronService(payload)
  //       break;
  //     case coinList[3]:
  //       this.wt = new TheOpenNetworkService(payload)
  //       break;
  //     case coinList[4]:
  //       this.wt = new SolanaService(payload)
  //       break;
  //     default:
  //       throw ErrorInterceptor.ExpectationFailed("Received wrong coin name.")
  //   }
  // }
}

export default new CryptoService();
