
import ApiError from '../exceptions/apiError';
import { WALLET_LIST } from '../interfaces/Wallets.interface';
import { DbCore } from './db.core';
import { coinList } from './lib.helper/coinList';
import { OkPacket, QueryError, RowDataPacket } from 'mysql2';

class Database extends DbCore {

	constructor() {
		super()
	}

	// saveUserWallet -> save each wallet to db for current user and domain
	public async saveUserWallet(walletArr: WALLET_LIST): Promise<OkPacket | QueryError> {
		let result: OkPacket | QueryError
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
			result = await super.insertData(sql, listOfValues)
		}
		return result
	}

  async getWalletSecretKey(address: string, coinName: string): Promise<RowDataPacket[] | QueryError>  {

		const sql: string = `
			SELECT private_key, public_key
			FROM wallet_list
			WHERE wallet_address = ?
			AND coin_name = ?
			`;

		return await super.selectData(sql, [address, coinName])
	}

	
  async isActiveAddress(coinName: string, userId: string, curDate: number): Promise<RowDataPacket[] | QueryError>  {
    
    const from: number = curDate - (1000 * 60 * 30)
    const to: number = curDate + (1000 * 60 * 30)

    const sql: string = `
      SELECT DISTINCT wallet_address, expired_date 
      FROM wallet_list 
      WHERE coin_name = ?
      AND user_id = ? 
      AND expired_date 
      BETWEEN ?
      AND ? 
		`;
		return await super.selectData(sql, [coinName, userId, from, to])
  }

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

}

export default new Database()