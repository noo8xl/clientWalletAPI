// import { WalletDatabaseService } from "../database/wallet.db.service"
// import ErrorInterceptor from "../../exceptions/Error.exception"
// import cryptoService from "../crypto/crypto.service"

// import { WALLET_LIST } from "../../types/wallet/wallet.types"

// // https://www.geeksforgeeks.org/how-to-handle-child-threads-in-node-js/


// type wtBalanceStruct = {
//   coinName: string
//   address: string
//   balance: number
// }

// export class ParserService {
//   private readonly coinName: string
//   private wtList: WALLET_LIST[]
//   private balances: wtBalanceStruct[]
//   private databaseService: WalletDatabaseService


//   constructor(coinName: string){
//     this.coinName = coinName
//     this.databaseService = new WalletDatabaseService()
//   }

//   // getWalletListByParams -> get wallets from a database by set params
//   async getWalletListByParams(): Promise<void> {
//     let walletList: any = await this.databaseService.getWalletList(this.coinName)
//     if(!walletList.length) {
//       console.log("empty set. wallet list len is -> ", walletList.length);
//       return
//     }
//     this.wtList = walletList
//   }

//   // getWalletBalances -> get balances, update wallet statuses, and push balances in <this.balances> array
//   async getWalletBalances(): Promise<void> {

//     balanceSeeker: for (let i = 0; i <= this.wtList.length -1; i++) {
//       let balance: number = await cryptoService.getBalance({coinName: this.wtList[i].coinName, address: this.wtList[i].address})
//       if(balance < 0)
//         throw await ErrorInterceptor.ServerError(`
//           getWalletBalances was failed. The wallet is: 
//           coinName: ${this.coinName}, 
//           address: ${this.wtList[i].address}`
//         )
//       if(balance === 0) await this.databaseService.updateWalletStatus(this.wtList[i].id, false, true)
//       if(balance > 0) {
//         this.balances.push({coinName: this.wtList[i].coinName, address: this.wtList[i].address, balance: balance})
//         await this.databaseService.updateWalletBalance(this.wtList[i].id, this.wtList[i].balance)
//         await this.databaseService.updateWalletStatus(this.wtList[i].id, true, true)
//       }
//       continue balanceSeeker;
//     }
//   }

//   // getCoinsFromWallet -> run through the <this.balances> and call <sendTransaction> here to send the coins from wallet to owner
//   async getCoinsFromWallet(): Promise<void> {
// 		console.log("balance array length is -> ", this.balances.length);

// 		try	{
// 			while (this.balances.length != 0) {
// 				await cryptoService.sendTransactionAutomatically({coinName: this.coinName, address: this.balances[0].address})
// 				this.balances.shift()
// 				await this.getCoinsFromWallet()
// 			}
// 		} catch (e) {
// 			throw await ErrorInterceptor.ServerError(`
//         getCoinsFromWallet was failed. The wallet was: 
//         coinName: ${this.balances[0].coinName}, 
//         address: ${this.balances[0].address}
//         `)
// 		}
//   }
// }