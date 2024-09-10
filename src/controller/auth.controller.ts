

import { NextFunction, Request, Response } from "express"
import authService from "../service/auth/auth.service"
import ErrorInterceptor  from "../exceptions/Error.exception";

class AuthController {

	async signUpNewClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.signUpNewClient(req.body)
    } catch (e) {
      next(e)
    }
		res.status(201).json({message: "client successfully created"}).end()
	}


}

export default new AuthController()