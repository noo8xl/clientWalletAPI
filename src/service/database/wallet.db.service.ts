
import mysql from 'mysql2'
import { ResultSetHeader, QueryError } from 'mysql2';
import { TelegramNotificationApi } from '../../api/notificationCall.api';
import { MYSQL_DB, coinList } from '../../config/configs';
import { DB_SELECT_RESPONSE } from '../../types/database/db.response.types';
import { WalletDatabaseCore } from './db.wallet.core';

export class WalletDatabaseService {
	private db: mysql.Connection
  private readonly dbHost = MYSQL_DB.host
	private readonly dbUser = MYSQL_DB.userName
	private readonly dbPassword = MYSQL_DB.userPassword
	private readonly dbName = MYSQL_DB.databaseName

	private dbInteract: WalletDatabaseCore
	private readonly notificator: TelegramNotificationApi = new TelegramNotificationApi()


	constructor() {
		this.initConnection()
	}


  async insertData(): Promise<boolean>{
    return false
  }

  async selectData(): Promise<DB_SELECT_RESPONSE> {
    let c: DB_SELECT_RESPONSE;
    return c
  }

  async updateData(): Promise<boolean> {
    return false
  }
  async deleteData(): Promise<boolean>{
    return false
  }


	// saveUserWallet -> save each wallet to db for current user and domain
	public async saveUserWallet(walletArr: any): Promise<ResultSetHeader | QueryError> {
		let result: ResultSetHeader | QueryError
		const sql: string = `
      INSERT INTO wallet_list 
      ( coin_name, wallet_address, private_key, public_key, date_of_create, domain_name, user_id) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?)
      `;

		for(let i=0; i <= coinList.length -1; i++) {
			const listOfValues: any[] = [
				walletArr[i].coinName,
				walletArr[i].address,
				walletArr[i].privateKey,
				walletArr[i].publicKey,
				walletArr[i].dateOfCreate,
				walletArr[i].domainName,
				walletArr[i].userId,
			]
			this.dbInteract = new WalletDatabaseCore(this.db, sql, listOfValues)
			result = await this.dbInteract.insertData()
		}
		this.closeConnection()
		return result
	}

  async getWalletSecretKey(address: string, coinName: string): Promise<DB_SELECT_RESPONSE>  {
		let result: DB_SELECT_RESPONSE;

		const sql: string = `
			SELECT private_key, public_key
			FROM wallet_list
			WHERE wallet_address = ?
			AND coin_name = ?
			`;

		this.dbInteract = new WalletDatabaseCore(this.db, sql, [address, coinName])
		result = await this.dbInteract.selectData()
		this.closeConnection()

		return result
	}

	
  // async isActiveAddress(coinName: string, userId: string, curDate: number): Promise<RowDataPacket[] | QueryError>  {
    
  //   const from: number = curDate - (1000 * 60 * 30)
  //   const to: number = curDate + (1000 * 60 * 30)

  //   const sql: string = `
  //     SELECT DISTINCT wallet_address, expired_date 
  //     FROM wallet_list 
  //     WHERE coin_name = ?
  //     AND user_id = ? 
  //     AND expired_date 
  //     BETWEEN ?
  //     AND ? 
	// 	`;
	// 	return await this.selectData(sql, [coinName, userId, from, to])
  // }

	// ___________________________________________________________





	//   async changeWalletStatus(userId: string, status: boolean): Promise<OkPacket | QueryError> {
//     mysql.connect((err: db.QueryError | null) => {
//       if (err) return console.error(err)
//       return console.log('mysql database was connected.')
//     })

//     const sql: string = `
//       UPDATE crypto_accounts 
//       SET isActive = ? 
//       WHERE userId = ?
//       `;
//     return new Promise((resolve, reject) => {
//       mysql.query<OkPacket>(
//         sql,
//         [userId, status],
//         (err: any, result, fields?) => {
//           if(err) reject(new Error(err))
//           console.log('result => ',result);
//           // console.log('field packet => ',fields);
//           resolve(result)
//         }
//       )
//     })
//   }

	// async getDepositWalletList(from: number, to: number): Promise<RowDataPacket[] | QueryError>  {
	
	// 	const sql: string = `
	// 	SELECT *
	// 	FROM wallet_list
	// 	WHERE expired_date 
	// 	BETWEEN ?
	// 	AND ?
	// 	`;

	// 	await this.initConnection()

	// 	try {
	// 		return new Promise((resolve, reject) => {
	// 			this.mysql.query<RowDataPacket[]>(
	// 				sql,
	// 				[from, to],
	// 				(err: any, result, fields?) => {
	// 					if(err) reject(new Error(err))
	// 					console.log('result => ',result);
	// 					// console.log('field packet => ',fields);
	// 					resolve(result)
	// 				}
	// 			)
	// 		})
	// 	} catch (e) {
	// 		throw await ApiError.ServerError("test action str here <-")
	// 	}
	// }

  // initConnection -> init mysql connection 
	private async initConnection(): Promise<void>  {

		this.db = mysql.createConnection({
			host: this.dbHost,
			user: this.dbUser,
			password: this.dbPassword,
			database: this.dbName
		})

		this.db.connect(async (err: mysql.QueryError | null) => {
			if (err) return await this.notificator.sendErrorMessage(err.message)
			return console.log('mysql database was connected.')
		})

	}

	private closeConnection(): void {
		this.db.destroy()
	}

}

// export default new WalletDatabaseService()