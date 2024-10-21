import { NextFunction, Request, Response } from 'express';
import cryptoService from "../service/crypto/crypto.service";
import {GET_BALANCE_DTO, GET_WALLET_DETAILS_DTO, WALLET_REQUEST_DTO} from "../dto/crypto/wallet.dto";


// CryptoController -> handle user request 
class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
		
		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}

		try {
			const address: string = await cryptoService.generateOneTimeAddressByCoinName(dto)
			res.status(201).json({address}).end()
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

		try {
			const balance: GET_BALANCE_DTO = await cryptoService.getBalance(dto)
			res.status(200).json(balance).end()
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

		try {
			const result: string = await cryptoService.sendManualTransaction(dto)
			// if(typeof result === null) throw await ErrorInterceptor.ExpectationFailed("You should approve this action.")
			// if (!result) throw await ErrorInterceptor.BadRequest(`Can't send transaction in unknown ${dto.coinName} network or unavailable coin.`)
			res.status(200).json({transactionDetails: result}).end()
		} catch (e) {
			next(e)
		}
	}

}

export default new CryptoController()