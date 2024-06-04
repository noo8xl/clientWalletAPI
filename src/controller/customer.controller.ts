import { NextFunction, Request, Response } from "express";
import customerService from "../service/customer/customer.service";
import { CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../types/customer/customer.types";
import ErrorInterceptor  from "../exceptions/Error.exception";

class CustomerComtroller {

  public async changeFiatCurrencyDisplay(req: Request, res: Response, next: NextFunction): Promise<void>{
    let dto = { userId: req.params.userId, fiatName: req.params.fiatName }
    try {
      const result: boolean = await customerService.changeFiatDisplay(dto)
      if (!result) throw await ErrorInterceptor.BadRequest()
      res.status(202).json({message: "Fiat name was changed."}).end()
    } catch (e) {
      next(e)
    }
  }

  public async getActionsLog(req: Request, res: Response, next: NextFunction): Promise<void>{

    let dto: GET_ACTIONS_LIST = {
    userId: req.params.userId,
      skip: Number(req.params.skip),
      limit: Number(req.params.limit),
    }

    try {
      const result: CUSTOMER_ACTION[] | boolean = await customerService.getActionsData(dto)
      if (!result) throw await ErrorInterceptor.ServerError("get Action list")
      res.status(200).json(result).end()
    } catch (e) {
      next(e)
    }
  }

  public async revokeAnAccess(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      const result: boolean = await customerService.revokeApiAccess(req.params.userId)
      if (!result) throw await ErrorInterceptor.ServerError("revoke api access")
      res.status(202).json({message: "Access to API was revoked."}).end()
      } catch (e) {
      next(e)
    }
  }

}

export default new CustomerComtroller()