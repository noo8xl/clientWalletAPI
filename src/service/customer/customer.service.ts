import { Helper } from "../../helpers/helper";
import { CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { CacheService } from "../cache/cache.service";


export class CustomerServise {
  private readonly stamp: number = new Date().getTime()
  private helper: Helper
  private cacheService: CacheService
  private customerDb: CustomerDatabaseService

  constructor(){
    this.helper = new Helper()
    this.cacheService = new CacheService()
    this.customerDb = new CustomerDatabaseService()
  }

  // revokeApiAccess -> revoke customer api key
  public async revokeApiAccess(userId: string): Promise<void> {

    let dbDto = {
      filter: { userId },
      doc: { isActive: false, apiKey: "", updatedAt: this.stamp },
    }

    await this.customerDb.updateCustomerProfile(dbDto)
    await this.cacheService.clearCachedDataByKey(userId)
  }

  // changeFiatDisplay -> change fiat name display to another currency
  public async changeFiatDisplay(userDto: any): Promise<void> {
    await this.helper.validateObject(userDto)

    let dbDto = {
      filter: { userId: userDto.userId },
      doc: { fiatName: userDto.fiatName, updatedAt: this.stamp },
    }

    await this.customerDb.updateCustomerProfile(dbDto)
  }

  // getActionsData -> get customer actions data history
  public async getActionsData(userDto: GET_ACTIONS_LIST): Promise<DB_SELECT_RESPONSE> {
    await this.helper.validateObject(userDto)
    let result: DB_SELECT_RESPONSE = await this.customerDb.getActionHistory(userDto)
    return result
  }

  // setActionsData -> save customer actions data 
  public async setActionsData(actionLog: CUSTOMER_ACTION): Promise<void> {
    await this.helper.validateObject(actionLog)
    await this.customerDb.saveUserLogsData(actionLog)
  }


}
