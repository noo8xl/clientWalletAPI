import {MONGO_DB} from "../../config/configs"
import {TelegramNotificationApi} from "../../api/notification.api";
import {Helper} from "../../helpers/helper";
import {GET_ACTIONS_LIST} from "../../types/customer/customer.types";
import {CacheService} from "../cache/cache.service";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";

import mongoose from "mongoose";
import {Customer} from "../../entity/customer/Customer";
import {ActionLog} from "../../entity/action/ActionLog";
import {ACTION_STATUS} from "../../entity/action/ActionStatus";
import ErrorInterceptor from "../../exceptions/Error.exception";


export class CustomerDatabaseService {
  private readonly stamp: number = new Date().getTime()
  private readonly actionsModel = ActionModel
  private readonly customerModel = CustomerModel

  private status: boolean = true
  private helper: Helper
  private cacheService: CacheService
  private notificator: TelegramNotificationApi

  constructor() {
    this.helper = new Helper()
    this.cacheService = new CacheService()
    this.notificator = new TelegramNotificationApi()
  }

  // findUserByFilter -> find user data by dto object filter ex => {userId: '123', userEmail: 'ex@mail.net'}
  public async findUserByFilter(filter: any): Promise<Customer>{
    await this.initConnection()
    try {
      this.status = await this.helper.validateObject(filter)
      const result: Customer = await this.customerModel.findOne(filter)
      if (!result) throw ErrorInterceptor.NotFoundError()
      return result
    } catch (e: any) {
      throw await ErrorInterceptor.ServerError("db server error."+ e)
    }	finally {
			await this.disconnectClient()
		}
  }


  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(userDto: Customer ): Promise<boolean>  {
    await this.initConnection()
		let userId;
		let actionLog: ActionLog = new ActionLog()

    try {
      this.status = await this.helper.validateObject(userDto)  
      if(!this.status) return false
			const result = await this.customerModel.create(userDto)
			userId = result._id.toString()

			actionLog.setAction(userId, this.stamp, ACTION_STATUS.SUCCESS, "Customer has been successfully registered.")

      // set cache data here <- 

      await this.saveUserLogsData(actionLog.getAction())
    } catch (e: any) {
			throw ErrorInterceptor.ExpectationFailed(e)
    } finally {
      await this.disconnectClient()
    }
		return this.status
	}

  // updateCustomerProfile -> update fields in customer document 
  public async updateCustomerProfile(userDto: any): Promise<boolean> {
    await this.initConnection()
    let actionLog: ActionLog = new ActionLog()

    try {
      this.status = await this.helper.validateObject(userDto)
      
      const result = await this.customerModel.findOneAndUpdate(
        userDto.filter,
        userDto.doc,
        { returnOriginal: false }
      )

      !result
				? actionLog.setAction(
						userDto.userId, this.stamp,
						ACTION_STATUS.FAILED, "Customer updating was failed.")
				: actionLog.setAction(
						userDto.userId, this.stamp,
						ACTION_STATUS.SUCCESS, "Customer has been successfully updated.")

			await this.saveUserLogsData(actionLog.getAction())
    } catch (e: any) {
			throw ErrorInterceptor.ExpectationFailed(e.message())
    } finally {
      await this.disconnectClient()
    }
		return this.status

  }

  // getActionHistory -> get user action history by setted params
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<ActionLog[]> {
    await this.initConnection()
		// let logList: ActionLog = new ActionLog();
		let logList:
    try {
      logList = await this.actionsModel
        .find({ userId: userDto.userId })
        .skip(userDto.skip)
        .limit(userDto.limit)
        .exec()

			// logList
    } catch (e) {
			throw ErrorInterceptor.ExpectationFailed(e)
    } finally {
      await this.disconnectClient()
    }
		return logList
	}

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: ActionLog): Promise<void> {
    // await this.initConnection()
    try {
      this.status = await this.helper.validateObject(actionLog)
      await this.actionsModel.create(actionLog)
    } catch (e) {
      console.log("cached error \n-> ", e);
      this.status = false
    } finally {
      await this.disconnectClient()
    }
  }

  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //

  private async initConnection(): Promise<void> {
    await mongoose.connect(MONGO_DB.link)
  }

  private async disconnectClient(): Promise<void> {
    await mongoose.disconnect()
  }
}