import { NextFunction, Response, Request } from 'express';
import { AuthService } from '../service/auth.service';

export default async function validateAccessKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('request headers => ', req.headers);

  const key: string = req.headers.accesskey.toString()
  const authService: AuthService = new AuthService({apiKey: key})

  try {
    if (!key) {
      res.status(403)
      res.json({message: 'missing accesss headers'})
      res.end()
      next()
    }

    await authService.signInClient()
    console.log('access granted');
    next()
  } catch (e: unknown) {
    next(e)
  }
}