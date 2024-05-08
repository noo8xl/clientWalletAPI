import { QueryError, RowDataPacket } from "mysql2"
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types"
import mysql from "mysql2"
import { MongoClient } from 'mongodb'


export abstract class Database {
  dbHost?: string
  dbName: string
  dbUser: string
  dbPassword: string
  db: mysql.Connection | MongoClient

  constructor(db: mysql.Connection | MongoClient) { this.db = db }

  abstract insertData(): Promise<DB_INSERT_RESPONSE | Promise<() => DB_INSERT_RESPONSE>>;
  abstract selectData(): Promise<DB_SELECT_RESPONSE>;
  abstract updateData(): Promise<boolean>;
  abstract deleteData(): Promise<boolean>;

  // abstract initConnection(): Promise<void>;
  // abstract disconnectClietn(): Promise<void>;

}
