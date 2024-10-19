

import mongoose from "mongoose";
import {MONGO_DB} from "../../config/configs"

import ErrorInterceptor from "../../exceptions/Error.exception";

import {ACTION} from "../../types/action/Action.types";
import {GET_ACTIONS_LIST} from "../../types/customer/customer.types";
import {CUSTOMER} from "../../types/customer/customer.types";
import {CUSTOMER_PARAMS} from "../../types/customer/customer.types";
import {AUTH_CLIENT_DTO} from "../../dto/auth/client.dto.type";

import {Customer} from "../../entity/customer/Customer";
import {CustomerDetails} from "../../entity/customer/CustomerDetails";
import {ActionLog} from "../../entity/action/ActionLog";

import CustomerParamsModel from "../../models/CustomerParams.model";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";



export class CustomerDatabaseService {
  private readonly actionsModel = ActionModel
  private readonly customerModel = CustomerModel
	private readonly customerParamsModel = CustomerParamsModel

  constructor() {}

	public async getCustomerId(filter: any): Promise<string> {

		try {
			await this.initConnection()
			const response: CUSTOMER = await this.customerModel.findOne<CUSTOMER>(filter)
			return response._id.toString();

		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getCustomerId> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}
	}

  // findUserByFilter -> find user data by dto object filter ex => {userId: '123', userEmail: 'ex@mail.net'}
  public async findUserByFilter(filter: any): Promise<Customer>{

		let customer: Customer = new Customer()
		let customerDetails: CustomerDetails = new CustomerDetails()

    try {
			await this.initConnection()
      const candidate: CUSTOMER = await this.customerModel.findOne<CUSTOMER>(filter)
			const params: CUSTOMER_PARAMS = await this.customerParamsModel.findOne<CUSTOMER_PARAMS>({userId: filter?.userId})

			customer.setCustomer(candidate)
			customerDetails.setCustomerDetails(params)
			customer.setCustomerDetails(customerDetails)
			
			return customer.getCustomer()

    } catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <findUserByFilter> with err ${e}`)
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
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<ActionLog[]> {

		let logList: ActionLog[] = [];
		let actionItem: ActionLog = new ActionLog();

		try {
			await this.initConnection()
			let list: ACTION[] = await this.actionsModel
				.find<ACTION>({ customerId: userDto.userId })
				.skip(userDto.skip)
				.limit(userDto.limit)
				.exec()

			for (let i = 0; i <= list.length -1; i++) {
				actionItem.setAction(list[i])
				logList.push(actionItem.getAction())
			}

		} catch (e: unknown) {
			throw await ErrorInterceptor
				.ServerError(`customer db server was failed at <getActionHistory> with err ${e}`)
		} finally {
			await this.disconnectClient()
		}

		return logList
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