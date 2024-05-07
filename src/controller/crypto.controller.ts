import { Request, Response, NextFunction } from 'express';
import { TSX_DATA } from '../types/wallet/transactionData.interface';
import { GetDomainNameFromOrigin } from '../crypto.lib/lib.helper/getDomainName.helper';
import { CryptoService } from "../service/crypto.service";
import { WALLET_REQUEST_DTO } from '../types/wallet/wallet.types';


// CryptoController -> handle user request 
class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {

		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}

		const service: CryptoService = new CryptoService(dto)
		try {
			const address = await service.generateOneTimeAddressByCoinName()

			res.status(200)
			res.json({coinName: dto.coinName, address: address})
			res.end()
			
		} catch (e) {
			next(e)
		}
	}


	async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {

		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			address: req.params.address
		}

		const service: CryptoService =  new CryptoService(dto)
		try {
			const balance: number = await service.getBalance()

			res.status(200)
			res.json({coinName: dto.coinName, balance: balance})
			res.end()

		} catch (e) {
			next(e)
		}
	}
	
	async sendManualTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			address: req.params.address
		}
		const service: CryptoService = new CryptoService(dto)

		// -> should add telegram 2fa to verify transaction sending by owner

		// -> validate is trans was approved by user or not 
		// -> if not - send msg as response 
		// -> if yes -> sign tsx and send tsx info as response

		try {
			const tsx: string = await service.sendManualTransaction()

			res.status(200)
			res.json({transactionDetails: tsx})
			res.end()

			} catch (e) {
			next(e)
		}
	}

	// async checkAddress(req: Request, res: Response, next: NextFunction): Promise<Response> {
	// 	let result: boolean;
	// 	const dto = {
	// 		coinName: null,
	// 		userId: req.params.userId,
	// 		address: req.params.address
	// 	}
	// 	const service = new CryptoService(dto)
		
	// 	try {
	// 		result = await service.checkAddress()

	// 		return res.status(200).json({result})
	// 	} catch (e) {
	// 		next(e)
	// 	}
	// }
	

	// ============================================================================================================= //
  // ================================== private methods for internal usage only ================================ //
  // ============================================================================================================= //

	
	// -------------------------------------------------------------------------------- //
	// ----------------------------- test data ---------------------------------------- //
	// -------------------------------------------------------------------------------- //

	// async getTest(req: Request, res: Response, next: NextFunction): Promise<any> {
	// 	const message: string = 'hello api'
	// 	try {
	// 		return res.status(200).json()
	// 	} catch (e) {
	// 		next(e)
	// 	}
	// }


}

export default new CryptoController()