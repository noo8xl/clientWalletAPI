

import mysql, { ResultSetHeader, QueryError, RowDataPacket } from 'mysql2'
import { TelegramNotificationApi } from '../../api/notification.api';
import { MYSQL_DB } from '../../config/configs';
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from '../../types/database/db.response.types';
import { WALLET, WALLET_LIST } from '../../types/wallet/wallet.types';
import ErrorInterceptor from '../../exceptions/Error.exception';


export class WalletDatabaseService {
	private db: mysql.Connection
  private readonly dbHost = MYSQL_DB.host
	private readonly dbUser = MYSQL_DB.userName
	private readonly dbPassword = MYSQL_DB.userPassword
	private readonly dbName = MYSQL_DB.databaseName
	private status: boolean = true;

	private notificator: TelegramNotificationApi

	constructor() { 
		this.notificator = new TelegramNotificationApi()
		this.initConnection() 
	}


	// // saveUserWallet -> save each wallet to db for current user and domain
	// public async saveUserWallet(walletArr: WALLET): Promise<ResultSetHeader | QueryError> {
	// 	let result: ResultSetHeader | QueryError
	// 	const sql: string = `
	// 		INSERT INTO wallet_list 
	// 		( coin_name, wallet_address, private_key, public_key, date_of_create, domain_name, user_id) 
	// 		VALUES 
	// 		(?, ?, ?, ?, ?, ?, ?)
	// 		`;

	// 	for(let i=0; i <= coinList.length -1; i++) {
	// 		const listOfValues: any[] = [
	// 			walletArr[i].coinName,
	// 			walletArr[i].address,
	// 			walletArr[i].privateKey,
	// 			walletArr[i].publicKey,
	// 			walletArr[i].dateOfCreate,
	// 			walletArr[i].domainName,
	// 			walletArr[i].userId,
	// 		]
	// 		this.dbInteract = new WalletDatabaseCore(this.db, sql, listOfValues)
	// 		result = await this.dbInteract.insertData()
	// 	}
		
	// 	await this.closeConnection()
	// 	return result
	// }


	// saveUserWallet -> save wallet to db for current user
	public async saveUserWallet(walletDto: WALLET): Promise<boolean> {
		
		const stamp: number = new Date().getTime()

		// searchWalletql -> filter to get saved wallet id 
		const searchWalletql: string = `
			SELECT id, 
			FROM WalletList
			WHERE address = ?
		`;

		const walletListSql: string = `
			INSERT INTO WalletList 
      ( coinName, address, balance, userId )
      VALUES 
      (?, ?, ?)
		`;

		const walletDetailSql: string = `
			INSERT INTO WalletDetails
			( privateKey, publicKey, seedPhrase, mnemonic, walletId )
			VALUES 
			(?, ?, ?, ?, ?)
		`;

		const walletParamsSql: string = `
		INSERT INTO WalletParams 
		( isUsed, isChecked, createdAt, updatedAt, walletId )
		VALUES 
		(?, ?, ?, ?, ?)
		`;

		const walletListVals = [
			walletDto.coinName,
			walletDto.address,
			0,
			walletDto.userId,
		]
		
		let walletDetailVals = [
			walletDto.privateKey,
			walletDto.publicKey,
			"",
			"",
		]
		let walletParamsVals = [
			false,
			false,
			stamp,
			stamp,
		]
		
		await this.insertData(walletListSql, walletListVals)
		let result = await this.selectData(searchWalletql, [walletDto.address])
		if(!this.status) {
			await this.notificator.sendErrorMessage("wallet db selection")
			return false
		}
		walletDetailVals.push(result[0].id)
		walletParamsVals.push(result[0].id)

		// // could be refactored  ? * <--------------------------------------------------------------------------------------------------
		if ( walletDto.seedPhrase !== "" && walletDto.mnemonic !== "") {
			walletDetailVals[2] = walletDto.seedPhrase
			walletDetailVals[3] = walletDto.mnemonic
		}

		await this.insertData(walletDetailSql, walletDetailVals)
		await this.insertData(walletParamsSql, walletParamsVals)

		await this.closeConnection()
		return this.status
	}


	async getWalletList(coinName: string, fromStamp: number): Promise<WALLET_LIST[] | boolean> {

		let list: string = `WalletList.coinName, WalletList.address, WalletList.balance, WalletList.userId`;
		let details: string = `WalletDetails.publicKey, WalletDetails.privateKey`;
		let params: string = `WalletParams.isUsed, WalletParams.isChecked`;

		const sql: string = `
			SELECT ${list}, ${details}, ${params},
			FROM WalletList
			INNER JOIN WalletDetails
			ON WalletList.id = WalletDetails.walletId
			INNER JOIN WalletParams
			ON WalletList.id = WalletParams.walletId
			WHERE WalletList.coinName = ?
			AND WalletDetails.isUsed = ?
			AND WalletParams.createdAt >= ?
	`;

		const result: WALLET_LIST[] = await this.selectData(sql,[ coinName, false, fromStamp ])
		await this.closeConnection()
		return result
	}

	async updateWalletStatus(walletId: number, isUsed: boolean, isChecked: boolean): Promise<boolean> {

    const sql: string = `
      UPDATE WalletParams 
      SET isUsed = ?, isChecked = ? 
      WHERE walletId = ?
    `;
		await this.updateData(sql,[ isUsed, isChecked, walletId ])
		await this.closeConnection()
		return this.status
	}

	async updateWalletBalance(walletId: number, balance: number): Promise<boolean> {

		const stamp: number = new Date().getTime()
    const sqlBalance: string = `
      UPDATE WalletList 
      SET balance = ? 
      WHERE walletId = ?
    `;
		const sqlParams: string = `
			UPDATE WalletParams
			SET updatedAt = ? 
			WHERE id = ?
		`;
		await this.updateData(sqlBalance,[ balance, walletId ])
		await this.updateData(sqlParams,[ stamp, walletId ])
		await this.closeConnection()
		return this.status
	}


	// // getWalletPrivateKey -> get private key to sign and send transaction
  // async getWalletPrivateKey(address: string, coinName: string): Promise<any>  {
	// 	const sql: string = `
	// 		SELECT privateKey, 
	// 		FROM WalletDetails
	// 		WHERE address = ?
	// 		AND coinName = ?
	// 	`;

	// 	const result = await this.selectData(sql,[ address, coinName])
	// 	await this.closeConnection()
	// 	return result[0]
	// }


  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //


  private async insertData(sqlString: string, values: any[]): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.query<ResultSetHeader>(
				sqlString, values,
				async (err: any, result, fields?) => {
					if(err) reject(this.status = false)
					console.log("result -> ", result);
					resolve(null)
				}
			)
		})

  }

	private async selectData(sqlString: string, values: any[]): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.query(
				sqlString,
				values,
				async (err: any, result, fields?) => {
					if(err) reject(this.status = false)
						console.log("result -> ", result);
						resolve(null)
				}
			)
		})
  }

	private async updateData(sqlString: string, values: any[]): Promise<void> {
		return new Promise((resolve, reject) => {
      this.db.query<ResultSetHeader>(
        sqlString,
        values,
        (err: any, result, fields?) => {
          if(err) reject(this.status = false)
          console.log('result => ',result);
          resolve(null)
        }
      )
    })
	}


  // initConnection -> init mysql connection 
	private async initConnection(): Promise<void>  {

		this.db = mysql.createConnection({
			host: this.dbHost,
			user: this.dbUser,
			password: this.dbPassword,
			database: this.dbName
		})

		this.db.connect(async (err: mysql.QueryError | null) => {
			if (err) return await this.notificator.sendErrorMessage("Wallet DB connection")
			return console.log('mysql database was connected.')
		})

	}

	private async closeConnection(): Promise<void> {
		return new Promise((resolve, reject) => {
			resolve(this.db.destroy())
		})
	}

}

// export default new WalletDatabaseService()