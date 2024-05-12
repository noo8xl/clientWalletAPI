
import { Request, Response, NextFunction } from "express"
import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import { AuthService } from "../service/auth.service"

class AuthController {

  async signUpNewClient(req: Request, res: Response, next: NextFunction): Promise<void> {

    const clientDto: AUTH_CLIENT_DTO = req.body
    const service: AuthService = new AuthService(clientDto)
    await service.signUpNewClient()
    
    res.status(201)
    res.json({message: "client successfully created"})
    res.end()
  }

  async revokeAnAccess(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      
    } catch (e: unknown) {
      next(e)
    }
  }

  async doSome(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      
    } catch (e: unknown) {
      next(e)
    }
  }

}

export default new AuthController()