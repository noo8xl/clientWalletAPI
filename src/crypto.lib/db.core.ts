import * as db from 'mysql2'

import {OkPacket, QueryError, RowDataPacket} from 'mysql2';
import {DEPOSIT_WALLET_PARAMS} from "../interfaces/depositWallet.interface";
import { MYSQL_HOST, MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_PWD } from '../config/configs';
import TelegramNotificationApi from '../api/notificationCall.api';
import ApiError from 'src/exceptions/apiError';

export class DbCore {
  private readonly dbHost = MYSQL_HOST
	private readonly dbUser = MYSQL_DB_USER 
	private readonly dbPwd = MYSQL_PWD
	private readonly dbName = MYSQL_DB_NAME
	private mysql: db.Connection

  constructor(){}

  public async insertData(sqlString: string, values: any[]): Promise<OkPacket | QueryError> {
    
    try {
      await this.initConnection()

			return new Promise((resolve, reject) => {
        this.mysql.query<OkPacket>(
          sqlString, values,
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

  public async selectData(sqlString: string, [...vals]: any[]): Promise<RowDataPacket[] | QueryError> {

    try {
      await this.initConnection()

      return new Promise((resolve, reject) => {
        this.mysql.query<RowDataPacket[]>(
          sqlString,
          vals,
          (err: any, result, fields?) => {
            if(err) reject(new Error(err))
            console.log('result => ',result);
            // console.log('field packet => ',fields);
            resolve(result)
          }
        )
      })
      
    } catch (e) {
      throw await ApiError.ServerError("select was failed.")
    }

  }


  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //

  // initConnection -> init mysql connection 
	private async initConnection() {

		this.mysql = db.createConnection({
			host: this.dbHost,
			user: this.dbUser,
			password: this.dbPwd,
			database: this.dbName
		})

		this.mysql.connect(async (err: db.QueryError | null) => {
			if (err) return await new TelegramNotificationApi().sendErrorMessage(err.message)
			return console.log('mysql database was connected.')
		})

	}
}