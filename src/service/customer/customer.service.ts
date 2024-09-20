
import { CustomerDatabaseService } from "../database/customer.db.service";
import { CacheService } from "../cache/cache.service";

import { ActionLog } from "../../entity/action/ActionLog";

import { GET_ACTIONS_LIST } from "../../types/customer/customer.types";



class CustomerService {
  private readonly stamp: number = Date.now()
  private cacheService: CacheService
  private customerDb: CustomerDatabaseService

  constructor(){
    this.cacheService = new CacheService()
    this.customerDb = new CustomerDatabaseService()
  }

  // revokeApiAccess -> revoke a customer api key
  public async revokeApiAccess(userId: string): Promise<void> {

    let dbDto = {
      filter: { _id: userId },
      doc: { isActive: false, apiKey: "", updatedAt: this.stamp },
    }

    await this.cacheService.clearCachedDataByKey(userId)
    await this.customerDb.updateCustomerProfile(dbDto)
  }

  // changeFiatDisplay -> change fiat name display to another currency
  public async changeFiatDisplay(userDto: any): Promise<void> {

    let dbDto = {
      filter: { customerId: userDto.userId },
      doc: { fiatName: userDto.fiatName, updatedAt: this.stamp },
    }

		await this.customerDb.updateCustomerProfile(dbDto)
  }

  // getActionsData -> get customer actions data history
  public async getActionsData(userDto: GET_ACTIONS_LIST): Promise<ActionLog[]> {
    return await this.customerDb.getActionHistory(userDto)
  }

}

export default new CustomerService()