import { NextFunction, Response, Request } from 'express';
import AuthService from '../service/auth/auth.service';
import ErrorInterceptor from '../exceptions/Error.exception';

export async function validateAccessKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  const key: string = req.headers.accesskey.toString()
  if (!key) {
    res.status(403).json({message: 'missing accesses headers'}).end()
    return
  }

  let c: boolean = await AuthService.signInClient({apiKey: key})
  if (!c) throw ErrorInterceptor.UnauthorizedError()
  next()
}