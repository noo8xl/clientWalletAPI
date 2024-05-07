import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types"


export abstract class Database {
  dbHost: string
  dbName: string
  dbUser: string
  dbPassword: string

  constructor(dbName: string) {
    this.dbName = dbName
  }

  abstract insertData(): Promise<boolean>;
  abstract getData(): Promise<DB_SELECT_RESPONSE>;
  abstract updateData(): Promise<boolean>;
  abstract deleteData(): Promise<boolean>;

}
