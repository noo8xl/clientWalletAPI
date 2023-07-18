import { NextFunction, Response, Request } from 'express';

export default async function validateAccessKey(req: Request, res: Response, next: NextFunction) {
  console.log('request headers => ', req.headers);
  try {
    if (!req.headers.accesskey) 
      return res.status(403).json({message: 'missing headers'})

    if (req.headers.accesskey !== process.env.API_ACCESS_KEY) 
      return res.status(403).json({message: 'missing headers'})

    next()
    console.log('access granted');
  } catch (e: unknown) {
    next(e)
  }
}