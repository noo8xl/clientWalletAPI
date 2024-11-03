import { GET_BALANCE_DTO, WALLET_ITEM_RESPONSE, WALLET_REQUEST_DTO } from "src/dto/crypto/wallet.dto";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { CmdExecutor } from "./cmdExecutor";

export class WalletService extends CmdExecutor {
  readonly coinName: string;
  private readonly userId: string;
  private readonly address: string;
  private readonly addressTo: string;
  private readonly amountInCrypto: number;

  private readonly customerDb: CustomerDatabaseService;

  constructor(dto: WALLET_REQUEST_DTO) {
    super(dto.coinName);

    this.userId = dto.userId;
    this.coinName = dto.coinName;
    this.address = dto.address;

    this.customerDb = new CustomerDatabaseService();
  }

  // generate a new address for one time use
  public async createOneTimeAddress(): Promise<string> {
    return await this.createAddressCmd(["gwlt", this.coinName, this.userId]);
  }

  // generate a new permanent wallet
  public async createWallet(): Promise<WALLET_ITEM_RESPONSE[]> {
    let dto: WALLET_ITEM_RESPONSE;
    let response = [];

    let tmp: string = await this.createAddressCmd(["gwlt", "create", this.userId]);

    console.log("tmp -> ", tmp);
    let str: string[] = tmp.split("/");

    console.log("splitted -> ", str);

    for (let i = 1; i < str.length; i++) {
      console.log("item is -> ", str[i]);
      let payload = str[i].split(" ");
      console.log("payload is -> ", payload);
      let dto: WALLET_ITEM_RESPONSE = {
        coinName: payload[0],
        address: payload[1],
      };

      response.push(dto);
    }

    return response;
  }

  // get wallet balance
  public async getBalance(): Promise<GET_BALANCE_DTO> {
    const fiatName: string = await this.customerDb.getFiatName(this.userId);
    return await this.getBalanceCmd(["gb", this.coinName, this.address, fiatName]);
  }

  // send transaction from - to  (amount)
  public async sendTransaction(): Promise<string> {
    return await this.sendTransactionCmd([
      "tsx",
      this.coinName,
      this.address,
      this.addressTo,
      this.amountInCrypto.toString(),
    ]);
  }

  // ###################################################################################################

  // // get wallet details (statistics, etc)
  // public async getWallet(): Promise<GET_WALLET_DETAILS_DTO> {
  //   return await this.getWalletDetailsCmd([this.coinName, this.address])
  // }

  // // get transaction details (hash from db ?)
  // public async getTransactionInfo(): Promise<any> {
  //   return await this.getTransactionDetailsCmd( [''] )
  // }
}
