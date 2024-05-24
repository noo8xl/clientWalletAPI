import { Request, Response, NextFunction } from 'express';
import { CryptoService } from "../service/crypto/crypto.service";
import { WALLET_REQUEST_DTO } from '../types/wallet/wallet.types';


// CryptoController -> handle user request 
class CryptoController {
	private readonly cryptoService: CryptoService = new CryptoService()

	async generateWalletAddress(req: Request, res: Response): Promise<void> {

		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}

		const address: string = await this.cryptoService.generateOneTimeAddressByCoinName(dto)

		res.status(201)
		res.json({coinName: dto.coinName, address: address})
		res.end()

	}


	async getBalance(req: Request, res: Response): Promise<void> {

		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			address: req.params.address
		}

		const balance: number = await this.cryptoService.getBalance(dto)

		res.status(200)
		res.json({coinName: dto.coinName, balance: balance})
		res.end()

	}
	
	async sendManualTransaction(req: Request, res: Response): Promise<void> {
		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			address: req.params.address
		}

		// -> should add telegram 2fa to verify transaction sending by owner

		// -> validate is trans was approved by user or not 
		// -> if not - send msg as response 
		// -> if yes -> sign tsx and send tsx info as response

		const tsx: string = await this.cryptoService.sendManualTransaction(dto)

		res.status(200)
		res.json({transactionDetails: tsx})
		res.end()
	}
	

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