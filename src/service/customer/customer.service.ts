import { Helper } from "../../helpers/helper";
import { CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { CacheService } from "../cache/cache.service";

class CustomerService {
  private readonly stamp: number = new Date().getTime()
  private helper: Helper
  private cacheService: CacheService
  private customerDb: CustomerDatabaseService

  constructor(){
    this.helper = new Helper()
    this.cacheService = new CacheService()
    this.customerDb = new CustomerDatabaseService()
  }

  // revokeApiAccess -> revoke a customer api key
  public async revokeApiAccess(userId: string): Promise<boolean> {

    let dbDto = {
      filter: { _id: userId },
      doc: { isActive: false, apiKey: "", updatedAt: this.stamp },
    }

    await this.cacheService.clearCachedDataByKey(userId)
    return await this.customerDb.updateCustomerProfile(dbDto)
  }

  // changeFiatDisplay -> change fiat name display to another currency
  public async changeFiatDisplay(userDto: any): Promise<boolean> {
    await this.helper.validateObject(userDto)

    let dbDto = {
      filter: { id: userDto.userId },
      doc: { fiatName: userDto.fiatName, updatedAt: this.stamp },
    }

    return await this.customerDb.updateCustomerProfile(dbDto)
  }

  // getActionsData -> get customer actions data history
  public async getActionsData(userDto: GET_ACTIONS_LIST): Promise<CUSTOMER_ACTION[] | boolean> {
    await this.helper.validateObject(userDto)
    const result: CUSTOMER_ACTION[] | boolean = await this.customerDb.getActionHistory(userDto)
    return result
  }

  // setActionsData -> save customer actions data 
  public async setActionsData(actionLog: CUSTOMER_ACTION): Promise<void> {
    await this.helper.validateObject(actionLog)
    await this.customerDb.saveUserLogsData(actionLog)
  }

}

export default new CustomerService()