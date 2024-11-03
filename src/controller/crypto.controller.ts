import { NextFunction, Request, Response } from "express";
import cryptoService from "../service/crypto/crypto.service";
import { GET_BALANCE_DTO, WALLET_REQUEST_DTO } from "../dto/crypto/wallet.dto";

// CryptoController -> handle user request
class CryptoController {
  async generateWalletAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto: WALLET_REQUEST_DTO = {
      userId: req.params.userId,
      coinName: req.params.coinName.toLowerCase().replace("-", "/"),
    };

    try {
      const address: string = await cryptoService.generateOneTimeAddressByCoinName(dto);
      res.status(201).json({ address }).end();
    } catch (e) {
      next(e);
    }
  }

  async createWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const walletList: any = await cryptoService.createWallet(req.params.userId);
      res.status(201).json(walletList).end();
    } catch (e) {
      next(e);
    }
  }

  async getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto: WALLET_REQUEST_DTO = {
      userId: req.params.userId,
      coinName: req.params.coinName.toLowerCase().replace("-", "/"),
      address: req.params.address,
    };

    try {
      const balance: GET_BALANCE_DTO = await cryptoService.getBalance(dto);
      res.status(200).json(balance).end();
    } catch (e) {
      next(e);
    }
  }

  async sendManualTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cryptoService.sendManualTransaction(req.body);
      res.status(204).json({ message: "You should approve this action via telegram." }).end();
    } catch (e) {
      next(e);
    }
  }

  async sendAutoTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dto: WALLET_REQUEST_DTO = {
      userId: req.params.userId,
      coinName: req.params.coinName.toLowerCase().replace("-", "/"),
      address: req.params.address,
    };

    try {
      const hash: string = await cryptoService.sendTransactionAutomatically(dto);
      res.status(200).json({ transactionDetails: hash }).end();
    } catch (e) {
      next(e);
    }
  }
}

export default new CryptoController();
