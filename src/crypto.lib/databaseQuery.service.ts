import { mysql } from '../config/mysql.config';
import * as db from 'mysql2'

import {OkPacket, QueryError, RowDataPacket} from 'mysql2';
import {DEPOSIT_WALLET_PARAMS} from "../interfaces/depositWallet.interface";

class Database {

	async getDepositWalletList(from: number, to: number): Promise<RowDataPacket[] | QueryError>  {

		mysql.connect((err: db.QueryError | null) => {
			if (err) return console.error(err)
			return console.log('mysql database was connected.')
		})
	
		const sql: string = `
			SELECT *
			FROM wallet_list
			WHERE expired_date 
			BETWEEN ?
			AND ?
			`;
	
		return new Promise((resolve, reject) => {
			mysql.query<RowDataPacket[]>(
				sql,
				[from, to],
				(err: any, result, fields?) => {
					if(err) reject(new Error(err))
					console.log('result => ',result);
					// console.log('field packet => ',fields);
					resolve(result)
				}
			)
		})
	}

	async saveDepositWallet(walletData: DEPOSIT_WALLET_PARAMS): Promise<OkPacket | QueryError> {

		mysql.connect((err: db.QueryError | null) => {
			if (err) return console.error(err)
			return console.log('mysql database was connected.')
		})

		const sql: string = `
      INSERT INTO wallet_list 
      ( coin_name, wallet_address, private_key, public_key, user_id, expired_date, domain_name) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?)
      `;


		return new Promise((resolve, reject) => {
			mysql.query<OkPacket>(
				sql,
				[ walletData.coinName,
					walletData.address,
					walletData.privateKey,
					walletData.publicKey,
					walletData.userId,
					walletData.expiredDate,
					walletData.domainName
				],
				(err: any, result, fields?) => {
					if(err) reject(new Error(err))
					console.log('result => ',result);
					// console.log('field packet => ',fields);
					resolve(result)
				}
			)
		})
	}

  async getWalletSecretKey(address: string, coinName: string): Promise<RowDataPacket[] | QueryError>  {

		mysql.connect((err: db.QueryError | null) => {
			if (err) return console.error(err)
			return console.log('mysql database was connected.')
		})
	
		const sql: string = `
			SELECT private_key, public_key
			FROM wallet_list
			WHERE wallet_address = ?
			AND coin_name = ?
			`;
	
		return new Promise((resolve, reject) => {
			mysql.query<RowDataPacket[]>(
				sql,
				[address, coinName],
				(err: any, result, fields?) => {
					if(err) reject(new Error(err))
					console.log('result => ',result);
					// console.log('field packet => ',fields);
					resolve(result)
				}
			)
		})
	}

	
  async isActiveAddress(coinName: string, userId: string, curDate: number): Promise<RowDataPacket[] | QueryError>  {
    
    const from: number = curDate - (1000 * 60 * 30)
    const to: number = curDate + (1000 * 60 * 30)

    mysql.connect((err: db.QueryError | null) => {
      if (err) return console.error(err)
      return console.log('mysql database was connected.')
    })

    const sql: string = `
      SELECT DISTINCT wallet_address, expired_date 
      FROM wallet_list 
      WHERE coin_name = ?
      AND user_id = ? 
      AND expired_date 
      BETWEEN ?
      AND ? 
		`;

    return new Promise((resolve, reject) => {
      mysql.query<RowDataPacket[]>(
        sql,
        [coinName, userId, from, to],
        (err: any, result, fields?) => {
          if(err) reject(new Error(err))
          console.log('result => ',result);
          // console.log('field packet => ',fields);
          resolve(result)
        }
      )
    })
  }



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


}

export default new Database()