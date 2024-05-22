import { CUSTOMER_ACTION } from "../../types/customer/customer.types";
import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types";


export class CustomerServise {

  constructor(){}

  public async revokeApiAccess(userId: string): Promise<void> {};
  public async changeFiatDisplay(dto: any): Promise<void> {};
  public async getActionsData(dto: any): Promise<any> {};
  public async setActionsData(dto: CUSTOMER_ACTION): Promise<any> {};


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

