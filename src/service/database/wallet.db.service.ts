

import mysql, { ResultSetHeader, QueryError, RowDataPacket } from 'mysql2'
import { NotificationService } from '../notification/notification.service';
import { MYSQL_DB } from '../../config/configs';
// import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from '../../types/database/db.response.types';
import { WALLET, WALLET_LIST } from '../../types/wallet/wallet.types';
import ErrorInterceptor from '../../exceptions/Error.exception';


export class WalletDatabaseService {

	private db: mysql.Connection
  private readonly dbHost = MYSQL_DB.host
	private readonly dbUser = MYSQL_DB.userName
	private readonly dbPassword = MYSQL_DB.userPassword
	private readonly dbName = MYSQL_DB.databaseName

	private readonly notificator: NotificationService

	constructor() { 
		this.notificator = new NotificationService()
		// this.initConnection()
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
	public async saveUserWallet(walletDto: WALLET): Promise<void> {
		
		const stamp: number = new Date().getTime()
		const searchWalletSql: string = `SELECT id FROM WalletList WHERE address=?`;

		const walletListSql: string = `
			INSERT INTO wallet_list 
      ( coinName, address, balance, userId )
      VALUES 
      (?, ?, ?)
		`;

		const walletDetailSql: string = `
			INSERT INTO wallet_details
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

		try {
			await this.initConnection()

			await this.insertData(walletListSql, walletListVals)
			const savedWallet = await this.selectData(searchWalletSql, [walletDto.address])

			walletDetailVals.push(savedWallet[0].id)
			walletParamsVals.push(savedWallet[0].id)

			// // could be refactored  ? * <--------------------------------------------------------------------------------------------------
			if ( walletDto.seedPhrase !== "" && walletDto.mnemonic !== "") {
				walletDetailVals[2] = walletDto.seedPhrase
				walletDetailVals[3] = walletDto.mnemonic
			}

			await this.insertData(walletDetailSql, walletDetailVals)
			await this.insertData(walletParamsSql, walletParamsVals)

		} catch (e) {
			throw await ErrorInterceptor.ServerError(`db insertion was failed at <saveUserWallet> with err\n${e}`)
		} finally {
			await this.closeConnection()
		}
	}


	async getWalletList(coinName: string): Promise<WALLET_LIST[]> {

		let walletList: WALLET_LIST[];

		const sql = `
			SELECT wallet_list.id, wallet_list.coin_name, wallet_list.address, wallet_list.customer_id
			FROM wallet_list
			JOIN wallet_params
			ON wallet_list.id = wallet_params.wallet_id
			WHERE wallet_list.coin_name = ?
			AND wallet_params.is_checked = false
			AND wallet_params.is_used = false
			AND wallet_params.created_at 
			BETWEEN NOW() - INTERVAL 3 DAY 
			AND NOW()
		`;

		try {
			walletList = await this.selectData(sql,[coinName])
		} catch (e) {
			throw await ErrorInterceptor.ServerError(`db selection was failed at <getWalletList> with err\n${e}`)
		} finally {
			await this.closeConnection()
		}

		return walletList
	}

	async updateWalletStatus(walletId: number, balance: number, isChecked: boolean, isUsed: boolean): Promise<void> {

		const balSql = `
			UPDATE wallet_list
			SET balance = ? 
			WHERE id = ?
		`;

		const sql = `
      UPDATE wallet_params 
      SET is_used=?, is_checked=? 
      WHERE wallet_id=?
    `;

		try {
			await this.updateData(balSql,[ balSql, walletId ])
			await this.updateData(sql,[ isUsed, isChecked, walletId ])
		} catch (e) {
			throw await ErrorInterceptor.ServerError(`db update was failed at <updateWalletStatus> with err\n${e}`)
		} finally {
			await this.closeConnection()
		}
	}

	async updateWalletBalance(walletId: number, balance: number): Promise<void> {
		
		const stamp: number = new Date().getTime()

		let sql: string = `
			UPDATE WalletList
			SET balance = ? 
			FROM WalletList
			JOIN WalletParams ON WalletList.id = WalletParams.walletId
			UPDATE WalletParams
			SET WalletParams.updatedAt = ? 
			WHERE WalletParams.walletId = ?
		`;

		const balSql = `
		UPDATE wallet_list
		SET balance = ? 
		WHERE id = ?
		`;

		const sql = `
			UPDATE wallet_params 
			SET is_used=?, is_checked=? 
			WHERE wallet_id=?
		`;

		try {
			// await this.updateData(balSql,[ balance, walletId ])
			await this.updateData(sql,[ balance, stamp, walletId ])
		} catch (e) {
			throw await ErrorInterceptor.ServerError(`db update was failed at <updateWalletBalance> with err\n${e}`)
		} finally {
			await this.closeConnection()
		}
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
		return new Promise<void>((resolve, reject) => {
			this.db.query<ResultSetHeader>(
				sqlString, values,
				async (err: any, result, fields?) => {
					if(err) reject()
					console.log("result -> ", result);
					resolve()
				}
			)
		})

  }

	private async selectData(sqlString: string, values: any[]): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.db.query(
				sqlString,
				values,
				async (err: any, result, fields?) => {
					if(err) reject(err)
					console.log("result -> ", result);
					resolve(result)
				}
			)
		})
  }

	private async updateData(sqlString: string, values: any[]): Promise<void> {
		return new Promise<void>((resolve, reject) => {
      this.db.query<ResultSetHeader>(
        sqlString,
        values,
        (err: any, result, fields?) => {
          if(err) reject(err)
          console.log('result => ',result);
          resolve()
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
			if (err) throw await ErrorInterceptor.ServerError("wallet database connection was failed.")
			console.log('mysql database was connected.')
		})

	}

	private async closeConnection(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			resolve(this.db.destroy())
		})
	}

}

// export default new WalletDatabaseService()