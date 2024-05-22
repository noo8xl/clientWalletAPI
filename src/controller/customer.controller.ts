import e, { NextFunction, Request, Response } from "express";
import { CustomerServise } from "src/service/customer/customer.service";


class CustomerComtroller {
  private readonly customerService: CustomerServise = new CustomerServise()


  public async changeFiatCurrencyDisplay(req: Request, res: Response): Promise<void>{

    let dto = {
      userId: req.params.userId,
      fiatName: req.params.fiatName,
    }

    await this.customerService.changeFiatDisplay(dto)
    
    res.status(202)
    res.json({message: "Access to API was revoked."})
    res.end()
  }


  public async getActionsLog(req: Request, res: Response): Promise<void>{
    let dto = {
      userId: req.params.userId,
      skip: Number(req.params.skip),
      limit: Number(req.params.limit),
    }

    let result = await this.customerService.getActionsData(dto)
    res.status(200)
    res.json(result)
    res.end()

  }

  public async revokeAnAccess(req: Request, res: Response): Promise<void>{
    const key: string = req.params.userId
    await this.customerService.revokeApiAccess(key)
    
    res.status(202)
    res.json({message: "Access to API was revoked."})
    res.end()
  }




}

export default new CustomerComtroller()