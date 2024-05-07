
import { Request, Response, NextFunction } from "express"
import { Http2ServerResponse } from "http2"
import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import ApiError from "src/exceptions/apiError"
import { AuthService } from "src/service/auth.service"

class AuthController {

  async signUpNewClient(req: Request, res: Response, next: NextFunction): Promise<void> {

    const clientDto: AUTH_CLIENT_DTO = req.body
    const service: AuthService = new AuthService(clientDto)

    try {
      await service.signUpNewClient()
      res.status(201)
      res.json({message: "client successfully created"})
      res.end()

    } catch (e: unknown) {
      next(e)
    }
    
  }
}

export default new AuthController()