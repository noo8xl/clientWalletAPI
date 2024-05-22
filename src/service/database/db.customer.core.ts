import { MongoClient } from "mongodb";
import { Database } from "./database.service";
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { ApiError } from "../../exceptions/apiError";

export class CustomerDatabaseCore extends Database {
  db: MongoClient
  dbName: string
  private filter: any
  private readonly collectionName: string = "Customer" // col are customer and logs ---> how to sole ?
  private readonly errorHandler: ApiError = new ApiError()
  

  constructor(db: MongoClient, dbName: string, filter: any) {
    super(db)
    this.db = db
    this.dbName = dbName
    this.filter = filter
  }

  public async insertData(): Promise<DB_INSERT_RESPONSE> {
    let c: DB_INSERT_RESPONSE;
    const database = this.db.db(this.dbName)
    const colection = database.collection(this.collectionName)
    try {
      c = await colection.insertOne(this.filter)
    } catch (e) {
      throw await this.errorHandler.ServerError("Customer DB insertion")
    }
    return c.insertedId.toString()
  }

  public async selectData(): Promise<DB_SELECT_RESPONSE> {
    let c: DB_SELECT_RESPONSE;
    return c
  }

  public async updateData(): Promise<boolean> {
    return false
  }
  public async deleteData(): Promise<boolean> {
    return false
  }

}