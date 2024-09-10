import { NextFunction, Request, Response } from 'express';
import cryptoService from "../service/crypto/crypto.service";
import { WALLET_REQUEST_DTO } from '../types/wallet/wallet.types';
import ErrorInterceptor  from "../exceptions/Error.exception";

// CryptoController -> handle user request 
class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}

		try {
			const result: string = await cryptoService.generateOneTimeAddressByCoinName(dto)
			res.status(201).json({coinName: dto.coinName, address: result}).end()
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
			const result: number = await cryptoService.getBalance(dto)
			res.status(200).json({coinName: dto.coinName, balance: result}).end()
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
			res.status(200).json({coinName: dto.coinName, transactionDetails: result}).end()
		} catch (e) {
			next(e)
		}
	}
	

	// ============================================================================================================= //
  // ================================== private methods for internal usage only ================================ //
  // ============================================================================================================= //



}

export default new CryptoController()