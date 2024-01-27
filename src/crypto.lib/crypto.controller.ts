import { Request, Response, NextFunction } from 'express';
import { TSX_DATA } from '../interfaces/transactionData.interface';
import { GetDomainNameFromOrigin } from './lib.helper/getDomainName.helper';
import CryptoService from "./crypto.service";


class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<Response> {
		let address: string;
		const dto = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}
		
		try {
			const service = new CryptoService(dto)
			address = await service.generateOneTimeAddressByCoinName()

			return res.status(200).json({address})
		} catch (e) {
			next(e)
		}
	}

	async checkAddress(req: Request, res: Response, next: NextFunction): Promise<Response> {
		let result: boolean;
		const dto = {
			coinName: null,
			userId: req.params.userId,
			address: req.params.address
		}
		
		try {
			const service = new CryptoService(dto)
			result = await service.checkAddress()

			return res.status(200).json({result})
		} catch (e) {
			next(e)
		}
	}

	async getBalance(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const coinName: string = req.params.coinName.toLowerCase().replace('-', '/')
		const address: string = req.params.address
		const dto = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}
		try {
			return res.status(200).json(await new CryptoService({coinName, address}).getBalance())
		} catch (e) {
			next(e)
		}
	}
	
	async sendManualTransaction(req: Request, res: Response, next: NextFunction): Promise<Response> {
		let result: boolean
		let tsxData: TSX_DATA = {
			coinName: req.params.coinName.toLowerCase().replace('-', '/'),
			domainName: await GetDomainNameFromOrigin(req.headers.origin),
			fromAddress: req.params.fromAddress,
			keyData: {
				privateKey: '',
				publicKey: ''
			},
			balance: 0,
			userId: req.params.userId
		}

		try {
			const service = new CryptoService({coinName: tsxData.coinName})
			result = await service.sendManualTransaction(tsxData)

			return res.status(200).json(result)
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