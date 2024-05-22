
import { Request, Response, NextFunction } from "express"
import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import { AuthService } from "../service/auth/auth.service"

class AuthController {
  private authService: AuthService

  async signUpNewClient(req: Request, res: Response): Promise<void> {

    const clientDto: AUTH_CLIENT_DTO = req.body
    this.authService = new AuthService(clientDto)
    await this.authService.signUpNewClient()

    res.status(201)
    res.json({message: "client successfully created"})
    res.end()
  }

}

export default new AuthController()