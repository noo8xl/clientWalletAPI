

import { Request, Response } from "express"
import authService from "../service/auth/auth.service"
// import ErrorInterceptor  from "../exceptions/apiError";

class AuthController {

  async signUpNewClient(req: Request, res: Response): Promise<void> {
    await authService.signUpNewClient(req.body)
    res.status(201).json({message: "client successfully created"}).end() 
  }

}

export default new AuthController()