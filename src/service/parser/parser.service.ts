// import database from './database/wallet.db.service'
// import Balance from '../crypto.lib/baseUsage/Balances'
// import ApiError from '../exceptions/apiError'
// import Transaction from '../crypto.lib/baseUsage/Transactions'
// import { TSX_DATA } from '../types/wallet/transactionData.interface'

// // https://www.geeksforgeeks.org/how-to-handle-child-threads-in-node-js/

// export async function balanceParser(): Promise<void> {
//   const curDate: number = new Date().getTime()
//   const fromStamp: number = curDate - (1000 * 60 * 60 * 48)
//   const toStamp: number = curDate + (1000 * 60 * 60 * 48)

//   console.log(`
//     cur  date => ${fromStamp},
//     curStamp => ${toStamp}
//   `);

//   const depositList: any = await database.getDepositWalletList(fromStamp, toStamp)
//   if (!depositList.length) throw await ApiError.NotFoundError('deposit wallet')

//   balanceFinding: for (let i: number = 0; i <= depositList.length - 1; i++) {
//     console.log('list iter is => ', depositList[i]);
//     const coin: string = depositList[i].coin_name
//     const address: string = depositList[i].wallet_address

//     const balanceValue: number = await new Balance(coin, address).CheckBalance()
		
// 		if (balanceValue !== 0) {	
// 			const dataObj: TSX_DATA = {
// 				coinName: depositList[i].coin_name,
//         domainName: depositList[i].domain_name,
// 				fromAddress: depositList[i].wallet_address,
//         keyData: {
//           privateKey: depositList[i].private_key,
//           publicKey: depositList[i].public_key
//         },
// 				userId: depositList[i].user_id,
// 				balance: balanceValue
// 			}

// 			const sendCrypto = new Transaction(dataObj).sendTransaction()
// 			console.log('sendCrypto result is => ', sendCrypto);
// 		} else {
// 			continue balanceFinding;
// 		}
   
//   } // end of balanceFinding loop < --------------

//   console.log('parser was done.');
//   return
// }

// // parentPort.on('message', async (data): Promise<any> => {
// //   console.log('data is => ', data);
// //   await balanceParser()
// //   parentPort.close()
// //   parentPort.on('close', () => {
// //     console.log('parser works is done.')
// //     return true
// //   })
// // })