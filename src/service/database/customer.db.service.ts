

import mongoose from "mongoose";
import {MONGO_DB} from "../../config/configs"

import ErrorInterceptor from "../../exceptions/Error.exception";

import {ACTION} from "../../types/action/Action.types";
import {GET_ACTIONS_LIST} from "../../types/action/Action.types";
import {CUSTOMER} from "../../types/customer/customer.types";
import {CUSTOMER_PARAMS} from "../../types/customer/customer.types";
import {AUTH_CLIENT_DTO} from "../../dto/auth/client.dto.type";

import CustomerParamsModel from "../../models/CustomerParams.model";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";
import { FIAT_NAME } from "src/types/wallet/wallet.types";



export class CustomerDatabaseService {
  private readonly actionsModel = ActionModel
  private readonly customerModel = CustomerModel
	private readonly customerParamsModel = CustomerParamsModel

  constructor() {}

	public async getCustomerId(userEmail: string): Promise<string> {

		try {
			await this.initConnection()
			const response: CUSTOMER = await this.customerModel.findOne<CUSTOMER>({userEmail})
			return response._id.toString();

		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getCustomerId> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}
	}

	public async getCustomerChatId(customerId: string): Promise<number> {

    try {
			await this.initConnection()
			return await this.customerParamsModel.findOne<number>({customerId}, {projection: {telegramId: 1}})
			
    } catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getCustomerChatId> with err ${e}`)
    } finally {
			await this.disconnectClient()
		}

	}

	public async getCustomerIdByTelegramChatId(chatId: number): Promise<string> {

    try {
			await this.initConnection()
			return (await this.customerParamsModel.findOne<number>({telegramId: chatId}, {projection: {customerId: 1}})).toString()
			
    } catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getCustomerIdByTelegramChatId> with err ${e}`)
    } finally {
			await this.disconnectClient()
		}

	}

	

	public async getFiatName(customerId: string): Promise<string> {
		
		try {
			await this.initConnection()
			return (await this.customerParamsModel.findOne<FIAT_NAME>({customerId}, {projection: {fiatName: 1}})).toString()
			
    } catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getFiatName> with err ${e}`)
    } finally {
			await this.disconnectClient()
		}

	}



  // saveNewClient -> save new user with default params
	public async saveNewClient(userDto: AUTH_CLIENT_DTO ): Promise<void>  {

		let log: ACTION = {
			action: "Customer has been successfully signed up.",
			customerId: ''
		}

		let base = {
			userEmail: userDto.userEmail,
			domainName: userDto.domainName,
			companyName: userDto.companyName,
		}
		let params = {
			apiKey: userDto.apiKey,
			telegramId: userDto.telegramId
		}

		try {
			await this.initConnection()
			let customer: CUSTOMER = await this.customerModel.create<CUSTOMER>(base)
			await this.customerParamsModel.create(params)

			log.customerId = customer._id.toString()
			await this.saveUserLogsData(log)

		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <saveNewClient> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}
	}

  // updateCustomerProfile -> update fields in customer document 
  public async updateCustomerProfile(userDto: any): Promise<void> {

		let log: ACTION = {
			action: "Customer has been successfully updated.",
			customerId: ''
		}

    try {
			await this.initConnection()

			let base = await this.customerModel.findOneAndUpdate<CUSTOMER>(
				userDto.filter,
				userDto.doc,
				{ returnOriginal: false }
			)

			await this.customerParamsModel.findOneAndUpdate<CUSTOMER_PARAMS>(
				{ returnOriginal: false }
			)

			log.customerId = base._id.toString()
			await this.saveUserLogsData(log)

    } catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <updateCustomerProfile> with err ${e}`)
    } finally {
      await this.disconnectClient()
    }
  }

  // getActionHistory -> get user action history
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<ACTION[]> {

		try {
			await this.initConnection()
			let logList: ACTION[] = await this.actionsModel
				.find<ACTION>({ customerId: userDto.userId })
				.skip(userDto.skip)
				.limit(userDto.limit)
				.exec()

			return logList
		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getActionHistory> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}
	}

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: ACTION): Promise<void> {

		try {
			await this.initConnection()
			await this.actionsModel.create<ACTION>(actionLog)

		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <saveUserLogsData> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}
  }

  // ============================================================================================================= //
  // ########################################## internal methods area ############################################ //
  // ============================================================================================================= //

  private async initConnection(): Promise<void> {
    await mongoose.connect(MONGO_DB.link)
			// .then(async () => { console.log("customer db connected") })
			.catch(async (e: unknown) => {
				throw await ErrorInterceptor.ServerError(`Customer database connection error ${e}`)
			})
  }

  private async disconnectClient(): Promise<void> {
    await mongoose.disconnect()
  }
}