import { MONGO_DB } from "../../config/configs"
import { TelegramNotificationApi } from "../../api/notification.api";
import { Helper } from "../../helpers/helper";
import { CUSTOMER, CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { CacheService } from "../cache/cache.service";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";

import mongoose from "mongoose";



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
  public async findUserByFilter(filter: any): Promise<any>{
    await this.initConnection()
    try {
      this.status = await this.helper.validateObject(filter)
      const result: CUSTOMER = await this.customerModel.findOne(filter)
      await this.disconnectClient()
      if (!result) return false
      return result
    } catch (e) {
      console.log("cached error \n-> ", e);
      return false
    }
  }


  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(userDto: CUSTOMER ): Promise<boolean>  {
    await this.initConnection()
    let actionLog: CUSTOMER_ACTION = {
      userId: "",
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully registred."
    }

    try {
      this.status = await this.helper.validateObject(userDto)  
      if(!this.status) return false
      const result = await this.customerModel.create(userDto)
      actionLog.userId = result._id.toString()

      // const cache: CACHE_DTO = { 
      //   key: result._id.toString(), //  -> using as key
      //   value: userDto.apiKey, // using as value 
      // }

      // this.status =  await this.cacheService.setSessionData(cache)
      await this.saveUserLogsData(actionLog)
    } catch (e) {
      console.log("cached error \n-> ", e);
      this.status = false
    } finally {
      await this.disconnectClient()
      return this.status
    }
	}

  // updateCustomerProfile -> update fields in customer document 
  public async updateCustomerProfile(userDto: any): Promise<boolean> {
    await this.initConnection()
    let actionLog: CUSTOMER_ACTION = {
      userId: userDto.userId,
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully updated."
    }

    try {
      this.status = await this.helper.validateObject(userDto)
      
      const result = await this.customerModel.findOneAndUpdate(
        userDto.filter,
        userDto.doc,
        { returnOriginal: false }
      )

      if (!result) {
        actionLog.status = "failed"
        actionLog.action = "Customer updating was failed."
      }

      await this.saveUserLogsData(actionLog)
    } catch (e) {
      console.log("cached error \n-> ", e);
      this.status = false
    } finally {
      await this.disconnectClient()
      return this.status
    }

  }

  // getActionHistory -> get user action history by setted params
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<CUSTOMER_ACTION[] | boolean> {
    await this.initConnection()
    try {
      const result = await this.actionsModel
        .find({ userId: userDto.userId })
        .skip(userDto.skip)
        .limit(userDto.limit)
        .exec()
      return result
    } catch (e) {
      console.log("cached error \n-> ", e);
      this.status = false
    } finally {
      await this.disconnectClient()
      return this.status
    }
  }

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: CUSTOMER_ACTION): Promise<void> {
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