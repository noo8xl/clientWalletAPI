import { NextFunction, Request, Response } from 'express';
import cryptoService from "../service/crypto/crypto.service";
import { WALLET_REQUEST_DTO } from '../types/wallet/wallet.types';
import ErrorInterceptor  from "../exceptions/apiError";


// CryptoController -> handle user request 
class CryptoController {

	async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
		console.log("controller");
		
		const dto: WALLET_REQUEST_DTO = {
			userId: req.params.userId,
			coinName: req.params.coinName.toLowerCase().replace('-', '/')
		}
		console.log("dto -> ", dto);

		try {
		const result: string | boolean = await cryptoService.generateOneTimeAddressByCoinName(dto)
    if (!result) throw await ErrorInterceptor.BadRequest(`Can't send transaction in unknown ${dto.coinName} network or unavailable coin.`) 
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
			if (result < 0) throw await ErrorInterceptor.ServerError("get balance")
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

		// -> should add telegram 2fa to verify transaction sending by owner

		// -> validate is trans was approved by user or not 
		// -> if not - send msg as response 
		// -> if yes -> sign tsx and send tsx info as response


		try {
			const result: boolean | string = await cryptoService.sendManualTransaction(dto)
			if (!result) throw await ErrorInterceptor.BadRequest(`Can't send transaction in unknown ${dto.coinName} network or unavailable coin.`) 
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