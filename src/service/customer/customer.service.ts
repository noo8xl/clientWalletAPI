import { Helper } from "src/helpers/helper";
import { CUSTOMER_ACTION, GET_ACTIONS_LIST } from "../../types/customer/customer.types";
import { DB_INSERT_RESPONSE, DB_SELECT_RESPONSE } from "../../types/database/db.response.types";
import { CustomerDatabaseService } from "../database/customer.db.service";


export class CustomerServise {

  private stamp: number = new Date().getTime()

  private readonly helper: Helper = new Helper()
  private readonly customerDb: CustomerDatabaseService = new CustomerDatabaseService()

  constructor(){ }

  public async revokeApiAccess(userId: string): Promise<void> {

    let dbDto = {
      filter: { userId },
      doc: { $set: { isActive: false, apiKey: "", updatedAt: this.stamp } },
    }

    await this.customerDb.updateCustomerProfile(dbDto)
  }


  public async changeFiatDisplay(userDto: any): Promise<void> {
    await this.helper.validateObject(userDto)

    let dbDto = {
      filter: { userId: userDto.userId },
      doc: { $set: { fiatName: userDto.fiatName, updatedAt: this.stamp } },
    }

    await this.customerDb.updateCustomerProfile(dbDto)
  }

  public async getActionsData(userDto: GET_ACTIONS_LIST): Promise<DB_SELECT_RESPONSE> {
    await this.helper.validateObject(userDto)

    let dbDto = {
      filter: { userId: userDto.userId },
      doc: { $skip: userDto.skip , $limit: userDto.limit },
    }

    let result: DB_SELECT_RESPONSE = await this.customerDb.getActionHistory(dbDto)
    return result
  }

  public async setActionsData(actionLog: CUSTOMER_ACTION): Promise<any> {
    await this.helper.validateObject(actionLog)
    await this.customerDb.saveUserLogsData(actionLog)
  }


}

// fiat name 
// createdAt
// updatedAt
// 

// export abstract class Actions {

//   constructor(){}

//   abstract saveCustomerLog(): Promise<boolean>;
//   abstract getCustomerLog(): Promise<DB_SELECT_RESPONSE>;

//   // log history here 
// }

