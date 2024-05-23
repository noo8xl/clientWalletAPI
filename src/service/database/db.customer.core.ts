import { MongoClient } from "mongodb";
import { Database } from "./database.service";
import { CUSTOMER_DB_CONSTRUCTOR, DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { ApiError } from "../../exceptions/apiError";
import { CUSTOMER, CUSTOMER_ACTION } from "src/types/customer/customer.types";

export class CustomerDatabaseCore extends Database {
  db: MongoClient
  dbName: string // -> static param
  private filter: any
  private updatedDoc: any
  private collectionName: string 
  private readonly errorHandler: ApiError = new ApiError()
  

  constructor(db: MongoClient, dbDto: CUSTOMER_DB_CONSTRUCTOR) {
    super(db)
    this.db = db
    this.dbName = dbDto.databaseName
    this.collectionName = dbDto.collectionName
    this.filter = dbDto.filter
    this.updatedDoc = dbDto.updatedDoc
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
    const database = this.db.db(this.dbName)
    const colection = database.collection(this.collectionName)

    try {
      c = await colection.findOne(this.filter)
    } catch (e) {
      throw await this.errorHandler.ServerError("Customer DB selection")
    }
    return c
  }

  public async selectMultiplyData(): Promise<DB_SELECT_RESPONSE> {
    let c: DB_SELECT_RESPONSE;
    const database = this.db.db(this.dbName)
    const colection = database.collection(this.collectionName)

    try {
      c = await colection.find(this.filter).toArray()
    } catch (e) {
      throw await this.errorHandler.ServerError("Customer DB selection")
    }
    return c
  }

  public async updateData(): Promise<DB_INSERT_RESPONSE> {

    let c: DB_INSERT_RESPONSE;
    const database = this.db.db(this.dbName)
    const colection = database.collection(this.collectionName)

    try {
      let result = await colection.updateOne(this.filter, this.updatedDoc)
      c = result.upsertedId.toString()
    } catch (e) {
      throw await this.errorHandler.ServerError("Customer DB updating")
    }
    return c
  }


  public async deleteData(): Promise<boolean> {
    return false
  }

}