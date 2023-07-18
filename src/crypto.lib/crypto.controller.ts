import { Request, Response, NextFunction } from 'express';
import { TSX_DATA } from '../interfaces/transactionData.interface';
import { GetDomainNameFromOrigin } from './lib.helper/getDomainName.helper';
import CryptoService from "./crypto.service";

class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction) {
		const coinName: string = req.params.coinName.toLowerCase().replace('-', '/')
		const userId: string = req.params.userId
		try {
			const result: any = await new CryptoService(coinName, userId).generateWalletAddressByCoinName()
			return res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}

	async checkAddress(req: Request, res: Response, next: NextFunction) {
		const coinName: string = req.params.coinName.toLowerCase().replace('-', '/')
		const address: string = req.params.address
		try {
			return res.status(200).json(await new CryptoService(coinName, address).checkAddress())
		} catch (e) {
			next(e)
		}
	}

	async getBalance(req: Request, res: Response, next: NextFunction) {
		const coinName: string = req.params.coinName.toLowerCase().replace('-', '/')
		const address: string = req.params.address
		try {
			return res.status(200).json(await new CryptoService(coinName, address).getBalance())
		} catch (e) {
			next(e)
		}
	}
	
	async sendManualTransaction(req: Request, res: Response, next: NextFunction) {

		let tsxData: TSX_DATA = {
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			domainName: await GetDomainNameFromOrigin(req.headers.origin),
			fromAddress: req.params.fromAddress,
			keyData: {
				privateKey: '',
				publicKey: ''
			},
			balance: 0,
			userId: req.params.staffId
		}

		try {
			return res.status(200).json(await new CryptoService(tsxData.coinName).sendManualTransaction(tsxData))
		} catch (e) {
			next(e)
		}
	}
	
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