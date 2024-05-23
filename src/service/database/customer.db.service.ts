import { CUSTOMER_DB_CONSTRUCTOR, DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { MONGO_DB } from "../../config/configs"
import { MongoClient } from "mongodb";
import { CustomerDatabaseCore } from "./db.customer.core";
import { TelegramNotificationApi } from "../../api/notificationCall.api";
import { Helper } from "../../helpers/helper";
import { CUSTOMER, CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { CacheService } from "../cache/cache.service";
import { CACHE_DTO } from "../../types/cache/cache.types";


export class CustomerDatabaseService {
  private db: MongoClient
  private readonly mongoUri: string = MONGO_DB.uri
  private readonly dbUser: string = MONGO_DB.userName
  private readonly dbPassword: string = MONGO_DB.userPassword
  private readonly dbName: string = MONGO_DB.databaseName
  private readonly stamp: number = new Date().getTime()

  private dbInteract: CustomerDatabaseCore
  private readonly helper: Helper = new Helper()
  private readonly cacheService: CacheService = new CacheService()
  private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()


  constructor() { this.initConnection() }

  // findUserByFilter -> find user data by dto object filter ex => {userId: '123', userEmail: 'ex@mail.net'}
  public async findUserByFilter(filter: any): Promise<DB_SELECT_RESPONSE>{
    let c: DB_SELECT_RESPONSE;
    await this.helper.validateObject(filter)

    let dbDto: CUSTOMER_DB_CONSTRUCTOR = {
      databaseName: this.dbName,
      collectionName: "Customer",
      filter: filter
    }

    this.dbInteract = new CustomerDatabaseCore(this.db, dbDto)
    c = await this.dbInteract.selectData()

    await this.disconnectClient()
    return c
  }

  

  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(userDto: CUSTOMER ): Promise<void>  {
    await this.helper.validateObject(userDto)
    let expiredAt: number = this.stamp + 600_000

    let dbDto: CUSTOMER_DB_CONSTRUCTOR = {
      databaseName: this.dbName,
      collectionName: "Customer",
      filter: userDto
    }

    this.dbInteract = new CustomerDatabaseCore(this.db, dbDto)
    let result: DB_INSERT_RESPONSE = await this.dbInteract.insertData()

    let actionLog: CUSTOMER_ACTION = {
      userId: result.toString(),
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully registred."
    }


    const cache: CACHE_DTO = { 
      userId: result.toString(), 
      apiKey: userDto.apiKey,
      sessionExpired: expiredAt 
    }

    await this.cacheService.setSessionData(cache)
    await this.saveUserLogsData(actionLog)
    await this.disconnectClient()
	}

  // updateCustomerProfile -> update fields in customer document 
  public async updateCustomerProfile(userDto: any): Promise<void> {

    let dbDto: CUSTOMER_DB_CONSTRUCTOR = {
      databaseName: this.dbName,
      collectionName: "Customer",
      filter: userDto.filter,
      updatedDoc: userDto.doc
    }

    let actionLog: CUSTOMER_ACTION = {
      userId: userDto.userId,
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully updated."
    }

    this.dbInteract = new CustomerDatabaseCore(this.db, dbDto)
    let result: DB_INSERT_RESPONSE = await this.dbInteract.updateData()
    if (!result) {
      actionLog.status = "failed"
      actionLog.action = "Customer updating was failed."
    }
   
    await this.saveUserLogsData(actionLog)
    await this.disconnectClient()
  }

  // getActionHistory -> get user action history by setted params
  public async getActionHistory(userDto: any): Promise<DB_SELECT_RESPONSE> {
    let r: DB_SELECT_RESPONSE;

    let dbDto: CUSTOMER_DB_CONSTRUCTOR = {
      databaseName: this.dbName,
      collectionName: "Actions",
      filter: userDto,
      updatedDoc: userDto.doc
    }

    this.dbInteract = new CustomerDatabaseCore(this.db, dbDto)
    r = await this.dbInteract.selectMultiplyData()

    await this.disconnectClient()
    return r
  }

  // saveUserLogsData -> save customer actions log to db
  public async saveUserLogsData(actionLog: CUSTOMER_ACTION): Promise<void> {
    let dbDto: CUSTOMER_DB_CONSTRUCTOR = {
      databaseName: this.dbName,
      collectionName: "Actions",
      filter: actionLog
    }

    this.dbInteract = new CustomerDatabaseCore(this.db, dbDto)
    await this.dbInteract.insertData()
    await this.disconnectClient()
  }

  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //


  private async initConnection(): Promise<void> {
    const uri: string = await this.getMongoUri()
    if (!uri) throw await this.notificator.sendErrorMessage("Customer DB connection")
    this.db = new MongoClient(uri)
  }

  private async disconnectClient(): Promise<void> {
    await this.db.close()
  }

  private async getMongoUri(): Promise<string> {
    let template = this.mongoUri
  
    let temp = template.replace("<userName>", this.dbUser)
    let uri = temp.replace("<userPassword>", this.dbPassword)
    return uri
  }
}