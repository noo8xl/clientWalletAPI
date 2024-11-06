

import { NextFunction, Request, Response } from "express"
import authService from "../service/auth/auth.service"


class AuthController {

	async signUpNewClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // let key: string = req.headers.apiKey
      await authService.signUpNewClient(req.body)
			res.status(201).json({message: "client successfully created"}).end()
		} catch (e) {
      next(e)
    }
	}


}

export default new AuthController()