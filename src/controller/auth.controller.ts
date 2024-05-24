
import { Request, Response } from "express"
import { AuthService } from "../service/auth/auth.service"

class AuthController {
  private readonly authService: AuthService = new AuthService()

  async signUpNewClient(req: Request, res: Response): Promise<void> {
    await this.authService.signUpNewClient(req.body)

    res.status(201)
    res.json({message: "client successfully created"})
    res.end()
  }

}

export default new AuthController()