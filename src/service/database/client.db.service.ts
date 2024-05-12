import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { MONGO_DB } from "../../config/configs"
import { MongoClient } from "mongodb";
import { CustomerDatabaseCore } from "./db.customer.core";
import { TelegramNotificationApi } from "../../api/notificationCall.api";
import { Helper } from "../../helpers/helper";


export class CustomerDatabaseService {
  private readonly mongoUri: string = MONGO_DB.uri
  private readonly dbUser: string = MONGO_DB.userName
  private readonly dbPassword: string = MONGO_DB.userPassword
  private readonly dbName: string = MONGO_DB.databaseName
  private db: MongoClient

  private dbInteract: CustomerDatabaseCore
  private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()
  private readonly helper: Helper = new Helper()

  constructor() {
    this.initConnection()
  }

  public async isUserExists(): Promise<boolean> {
    let filter: any = {
      userEmail: this.user
    }

    return true
  }

  public async findUserByFilter(): Promise<DB_SELECT_RESPONSE>{
    let c: DB_SELECT_RESPONSE;
    let filter: any = {}
    
    await this.helper.validateObject(filter)
    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, filter)
    await this.dbInteract.selectData()

    await this.disconnectClient()
    return c
  }

  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(): Promise<DB_INSERT_RESPONSE>  {
		// add here field {fiatName: string}  // -> AUD, AED, RUB, EUR, USD  --- > default = USD 
    let filter: any = {}

    await this.helper.validateObject(filter)
    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, filter)
    this.dbInteract.insertData()

    await this.disconnectClient()
		return null
	}

  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //


  private async initConnection(): Promise<void> {
    const uri: string = await this.getMongoUri()
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