import mysql, { ResultSetHeader, QueryError, RowDataPacket } from 'mysql2'

import {TelegramNotificationApi} from '../../api/notificationCall.api';
import ApiError from '../../exceptions/apiError';
import { Database } from './database.service';
import { DB_INSERT_RESPONSE } from '../../types/database/db.response.types';


export class WalletDatabaseCore extends Database {
	db: mysql.Connection 
  private sqlString: string
  private values: any

  private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()

  constructor(db: mysql.Connection, sql: string, values: any){
    super(db)
    this.db = db
    this.sqlString = sql
    this.values = values
  }

  public async insertData(): Promise<DB_INSERT_RESPONSE> {
    
    try {
			return new Promise((resolve, reject) => {
        this.db.query<ResultSetHeader>(
          this.sqlString, this.values,
          (err: any, result, fields?) => {
            if(err) reject(new Error(err))
            console.log('result => ',result);
            // console.log('field packet => ',fields);
            resolve(result)
          }
        )
				})
		} catch (e) {
			throw await ApiError.ServerError("insertion was failed.")
		}
  }

  public async selectData(): Promise<RowDataPacket[] | QueryError> {

    try {
      return new Promise((resolve, reject) => {
        this.db.query<RowDataPacket[]>(
          this.sqlString,
          this.values,
          (err: any, result, fields?) => {
            if(err) reject(new Error(err))
            console.log('result => ',result);
            // console.log('field packet => ',fields);
            resolve(result)
          }
        )
      })
      
    } catch (e) {
      throw await ApiError.ServerError("selection was failed.")
    }

  }

  async updateData(): Promise<boolean> {
    return false
  }
  async deleteData(): Promise<boolean> {
    return false
  }


  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //

  // static async initConnection(): Promise<void> {
  //   const uri: string = await this.getMongoUri()
  //   this.db = new MongoClient(uri)
  // }

  // static async getMongoUri(): Promise<string> {
  //   let template = this.mongoUri
  
  //   let temp = template.replace("<userName>", this.dbUser)
  //   let uri = temp.replace("<userPassword>", this.dbPassword)
  //   return uri
  // }

}