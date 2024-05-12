import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types";


export abstract class Customer {

}

// fiat name 
// createdAt
// updatedAt
// 

export abstract class Actions {


  abstract saveCustomerLog(): Promise<boolean>;
  abstract getCustomerLog(): Promise<DB_SELECT_RESPONSE>;

  // log history here 
}

