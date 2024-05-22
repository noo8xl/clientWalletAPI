import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { MONGO_DB } from "../../config/configs"
import { MongoClient } from "mongodb";
import { CustomerDatabaseCore } from "./db.customer.core";
import { TelegramNotificationApi } from "../../api/notificationCall.api";
import { Helper } from "../../helpers/helper";
import { CUSTOMER, CUSTOMER_ACTION } from "../../types/customer/customer.types";
import { CacheService } from "../cache/cache.service";
import { CACHE_DTO } from "../../types/cache/cache.types";
import { CustomerServise } from "../customer/customer.service";


export class CustomerDatabaseService {
  private readonly mongoUri: string = MONGO_DB.uri
  private readonly dbUser: string = MONGO_DB.userName
  private readonly dbPassword: string = MONGO_DB.userPassword
  private readonly dbName: string = MONGO_DB.databaseName
  private db: MongoClient
  private readonly stamp: number = new Date().getTime()

  private dbInteract: CustomerDatabaseCore
  private readonly helper: Helper = new Helper()
  private readonly cacheService: CacheService = new CacheService()
  private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()
  private readonly customerService: CustomerServise = new CustomerServise()


  constructor() { this.initConnection() }

  // findUserByFilter -> find user data by dto object filter ex => {userId: '123', userEmail: 'ex@mail.net'}
  public async findUserByFilter(filter: any): Promise<DB_SELECT_RESPONSE>{
    let c: DB_SELECT_RESPONSE;
    
    await this.helper.validateObject(filter)
    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, filter)
    c = await this.dbInteract.selectData()

    await this.disconnectClient()
    return c
  }

  

  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(userDto: CUSTOMER ): Promise<void>  {
    await this.helper.validateObject(userDto)
    let expiredAt: number = this.stamp + 600_000

    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, userDto)
    let result: DB_INSERT_RESPONSE = await this.dbInteract.insertData()
    // console.log("inserted result is -> ", result);
    
    const actionLog: CUSTOMER_ACTION = {
      userId: String(result),
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
    await this.customerService.setActionsData(actionLog)
    await this.disconnectClient()
	}

  public async updateCustomerProfile(userDto: any): Promise<void> {

    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, userDto)
    // let result: DB_INSERT_RESPONSE = await this.dbInteract.updateData()

//
//
//
//
//
//
//
//

//
    // status depends on db result 
    // updated data isn't the same  -> success else -> failed

    const actionLog: CUSTOMER_ACTION = {
      userId: userDto.userId,
      date: this.stamp,
      status: "success",
      action: "Customer has been successfully registred."
    }
   
    await this.customerService.setActionsData(actionLog)
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