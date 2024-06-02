

import { NextFunction, Request, Response } from "express"
import authService from "../service/auth/auth.service"
import ErrorInterceptor  from "../exceptions/apiError";

class AuthController {

  async signUpNewClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.signUpNewClient(req.body)
      if (!result) throw await ErrorInterceptor.BadRequest("User already exists.")
      res.status(201).json({message: "client successfully created"}).end()
    } catch (e) {
      next(e)
    }
  }

}

export default new AuthController()