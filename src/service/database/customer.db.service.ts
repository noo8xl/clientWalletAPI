import { MongoClient } from "mongodb";
import { MONGO_DB } from "../../config/configs"
import { TelegramNotificationApi } from "../../api/notificationCall.api";
import { Helper } from "../../helpers/helper";
import { CUSTOMER, CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { CacheService } from "../cache/cache.service";
import ErrorInterceptor  from "../../exceptions/apiError";
import ActionModel from "../../models/Action.model";
import CustomerModel from "../../models/Customer.model";
import { connect, disconnect } from "mongoose";


export class CustomerDatabaseService {
  private readonly stamp: number = new Date().getTime()
  private readonly actionsModel = ActionModel
  private readonly customerModel = CustomerModel

  private helper: Helper
  private cacheService: CacheService
  private notificator: TelegramNotificationApi

  constructor() {
    this.helper = new Helper()
    this.cacheService = new CacheService()
    this.notificator = new TelegramNotificationApi()
    connect(MONGO_DB.link)
  }

  // findUserByFilter -> find user data by dto object filter ex => {userId: '123', userEmail: 'ex@mail.net'}
  public async findUserByFilter(filter: any): Promise<CUSTOMER>{
    try {
      await this.helper.validateObject(filter)
      return await this.customerModel.findOne(filter)
    } catch (e) {
      throw await ErrorInterceptor.ServerError("selection")
    } finally {
      await disconnect()
    }
  }


  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(userDto: CUSTOMER ): Promise<void>  {
    let actionLog: CUSTOMER_ACTION = {
      userId: "",
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully registred."
    }

    try {
      await this.helper.validateObject(userDto)  
      const result = await this.customerModel.create(userDto)
      actionLog.userId = result._id.toString()

      // const cache: CACHE_DTO = { 
      //   key: result._id.toString(), //  -> using as key
      //   value: userDto.apiKey, // using as value 
      // }

      // await this.cacheService.setSessionData(cache)
      await this.saveUserLogsData(actionLog)
    } catch (error) {
      // throw await ErrorInterceptor.ServerError("save client")
    } finally {
      await disconnect()
    }
	}

  // updateCustomerProfile -> update fields in customer document 
  public async updateCustomerProfile(userDto: any): Promise<void> {
    let actionLog: CUSTOMER_ACTION = {
      userId: userDto.userId,
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully updated."
    }

    try {
      await this.helper.validateObject(userDto)
      const result = await this.customerModel.findOneAndUpdate(
        userDto.filter,
        userDto.doc,
        // {returnOriginal: false}
      )

      if (!result) {
        actionLog.status = "failed"
        actionLog.action = "Customer updating was failed."
      }

      await this.saveUserLogsData(actionLog)
    } catch (error) {
      throw await ErrorInterceptor.ServerError("updating")
    } finally {
      await disconnect()
    }

  }

  // getActionHistory -> get user action history by setted params
  public async getActionHistory(userDto: GET_ACTIONS_LIST): Promise<CUSTOMER_ACTION[]> {
    try {
      const result = await this.actionsModel
      .find({ userId: userDto.userId })
      .skip(userDto.skip)
      .limit(userDto.limit)
      .exec()
      return result
    } catch (e) {
      throw await ErrorInterceptor.ServerError("selection")
    } finally {
      await disconnect()
    }
  }

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: CUSTOMER_ACTION): Promise<void> {
    try {
      await this.helper.validateObject(actionLog)
      await this.actionsModel.create(actionLog)
    } catch (e) {
      throw await ErrorInterceptor.ServerError("log saving")
    } finally {
      await disconnect()
    }
  }

  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //


  // private async initConnection(): Promise<void> {
  //   const uri: string = await this.getMongoUri()
  //   console.log("uri -> ", uri);
    
  //   if (!uri) return await this.errorHandler.ServerError("Customer DB connection")
  //   this.db = new MongoClient(uri)
  // }

  // private async disconnectClient(): Promise<void> {
  //   await this.db.close()
  // }

  // private async getMongoUri(): Promise<string> {
  //   let template = this.mongoUri
    
  
  //   let temp = template.replace("<userName>", this.dbUser)
  //   let uri = temp.replace("<userPassword>", this.dbPassword)
  //   return uri
  // }
}