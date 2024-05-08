import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "src/types/database/db.response.types";
import { MONGO_DB } from "../../config/configs"
import { MongoClient } from "mongodb";
import { CustomerDatabaseCore } from "./db.customer.core";
import { TelegramNotificationApi } from "src/api/notificationCall.api";


export class CustomerDatabaseService {
  private readonly mongoUri: string = MONGO_DB.uri
  private readonly dbUser: string = MONGO_DB.userName
  private readonly dbPassword: string = MONGO_DB.userPassword
  private readonly dbName: string = MONGO_DB.databaseName
  private db: MongoClient

  private dbInteract: CustomerDatabaseCore
  private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()

  constructor() {
    this.initConnection()
  }

  async findUserByFilter(): Promise<DB_SELECT_RESPONSE>{
    let c: DB_SELECT_RESPONSE;
    let filter: any = {}
    
    this.dbInteract = new CustomerDatabaseCore(this.db, this.dbName, filter)
    this.dbInteract.selectData()

    await this.disconnectClient()
    return c
  }

  // saveNewClient -> save new api user to db using mongoDB
	public async saveNewClient(): Promise<DB_INSERT_RESPONSE>  {
		// add here field {fiatName: string}  // -> AUD, AED, RUB, EUR, USD  --- > default = USD 
    let filter: any = {}

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