import mongoose from "mongoose";
import { MONGO_DB } from "../../config/configs";

import ErrorInterceptor from "../../exceptions/Error.exception";

import { ACTION } from "../../types/action/Action.types";
import { GET_ACTIONS_LIST } from "../../types/action/Action.types";
import { CUSTOMER } from "../../types/customer/customer.types";
import { CUSTOMER_PARAMS } from "../../types/customer/customer.types";
import { AUTH_CLIENT_DTO } from "../../dto/auth/client.dto.type";

import CustomerParamsModel from "../../models/CustomerParams.model";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";
// import { FIAT_NAME } from "src/types/wallet/wallet.types";

export class CustomerDatabaseService {
  private readonly actionsModel = ActionModel;
  private readonly customerModel = CustomerModel;
  private readonly customerParamsModel = CustomerParamsModel;

  constructor() {}

  public async getCustomerId(userEmail: string): Promise<string> {
    try {
      await this.initConnection();
      let id: string = await this.customerModel.findOne<string>({ userEmail }, { projection: { _id: 1 } });

      return id;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getCustomerId> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  public async getCustomerIdByApiKey(apiKey: string): Promise<string> {
    try {
      await this.initConnection();
      let params: CUSTOMER_PARAMS = await this.customerParamsModel.findOne({ apiKey });

      console.log("params -> ", params);
      return params.customerId;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getCustomerId> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  public async getCustomerDomainByTgChatId(chatId: number): Promise<string> {
    try {
      await this.initConnection();
      const customerId: string = await this.customerModel.findOne<string>(
        { telegramId: chatId },
        { projection: { customerId: 1 } },
      );

      let domain: string = await this.customerParamsModel.findOne<string>(
        { _id: customerId },
        { projection: { domainName: 1 } },
      );

      return domain;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getCustomerId> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  public async getCustomerChatId(customerId: string): Promise<number> {
    try {
      await this.initConnection();
      return await this.customerParamsModel.findOne<number>(
        { customerId },
        { projection: { telegramId: 1 } },
      );
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getCustomerChatId> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  public async getCustomerIdByTelegramChatId(chatId: number): Promise<string> {
    try {
      await this.initConnection();
      return (
        await this.customerParamsModel.findOne<number>(
          { telegramId: chatId },
          { projection: { customerId: 1 } },
        )
      ).toString();
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getCustomerIdByTelegramChatId> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  public async getFiatName(customerId: string): Promise<string> {
    try {
      await this.initConnection();
      return (
        await this.customerParamsModel.findOne({ customerId }, { projection: { fiatName: 1 } })
      ).toString();
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getFiatName> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  // saveNewClient -> save new user with default params
  public async saveNewClient(userDto: AUTH_CLIENT_DTO): Promise<void> {
    let log: ACTION = {
      action: "Customer has been successfully signed up.",
      customerId: "",
    };

    let base = {
      userEmail: userDto.userEmail,
      domainName: userDto.domainName,
      companyName: userDto.companyName,
    };
    let params = {
      apiKey: userDto.apiKey,
      telegramId: userDto.telegramId,
      customerId: "",
    };

    try {
      await this.initConnection();
      let customer: CUSTOMER = await this.customerModel.create<CUSTOMER>(base);
      log.customerId = customer._id.toString();
      params.customerId = customer._id.toString();

      await this.customerParamsModel.create(params);
      await this.saveUserLogsData(log);
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <saveNewClient> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  // updateCustomerProfile -> update fields in customer document
  public async updateCustomerProfile(userDto: any): Promise<void> {
    let params: CUSTOMER_PARAMS;
    let log: ACTION = {
      action: "Customer has been successfully updated.",
      customerId: "",
    };

    try {
      await this.initConnection();

      params = await this.customerParamsModel.findOneAndUpdate(userDto.filter, userDto.doc, {
        returnOriginal: false,
      });

      // console.log("params -> ", params);

      log.customerId = params.customerId.toString();
      await this.saveUserLogsData(log);
    } catch (e: unknown) {
      if (!params) throw ErrorInterceptor.BadRequest("possibly invalid id value");
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <updateCustomerProfile> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  // getActionHistory -> get user action history
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<ACTION[]> {
    try {
      await this.initConnection();
      let logList: ACTION[] = await this.actionsModel
        .find<ACTION>({ customerId: userDto.userId })
        .skip(userDto.skip)
        .limit(userDto.limit)
        .exec();

      return logList;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <getActionHistory> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: ACTION): Promise<void> {
    try {
      await this.initConnection();
      await this.actionsModel.create<ACTION>(actionLog);
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `customer db server was failed at <saveUserLogsData> with err ${e}`,
      );
    } finally {
      await this.disconnectClient();
    }
  }

  // ============================================================================================================= //
  // ########################################## internal methods area ############################################ //
  // ============================================================================================================= //

  private async initConnection(): Promise<void> {
    await mongoose
      .connect(MONGO_DB.link)
      // .then(async () => { console.log("customer db connected") })
      .catch(async (e: unknown) => {
        throw await ErrorInterceptor.ServerError(`Customer database connection error ${e}`);
      });
  }

  private async disconnectClient(): Promise<void> {
    await mongoose.disconnect();
  }
}
