import { NextFunction, Response, Request } from 'express';
import AuthService from '../service/auth/auth.service';

export async function validateAccessKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  const key: string = req.headers.accesskey.toString()
  // console.log("key -> " key);
  
  if (!key) {
    res.status(403)
    res.json({message: 'missing accesss headers'})
    res.end()
    next()
  }

  next(await AuthService.signInClient({apiKey: key}))
}