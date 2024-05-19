import e, { NextFunction, Request, Response } from "express";


class CustomerComtroller {


  async changeFiatCurrencyDisplay(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      
    } catch (e: unknown) {
      next(e)
    }
  }


  async getActionsLog(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      
    } catch (e: unknown) {
      next(e)
    }
  }

  


}

export default new CustomerComtroller()