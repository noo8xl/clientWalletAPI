import { MongoClient } from "mongodb";
import { Database } from "./database.service";
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";


export class CustomerDatabaseCore extends Database {
  db: MongoClient
  dbName: string
  private filter: any

  constructor(db: MongoClient, dbName: string, filter: any) {
    super(db)
    this.db = db
    this.dbName = dbName
    this.filter = filter
  }

  async insertData(): Promise<DB_INSERT_RESPONSE | Promise<() => DB_INSERT_RESPONSE>> {
    let c: DB_INSERT_RESPONSE;
    return c
  }

  async selectData(): Promise<DB_SELECT_RESPONSE> {
    let c: DB_SELECT_RESPONSE;
    return c
  }

  async updateData(): Promise<boolean> {
    return false
  }
  async deleteData(): Promise<boolean> {
    return false
  }

}