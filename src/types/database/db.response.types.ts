import { InsertOneResult, UpdateResult, WithId } from "mongodb";
import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { CUSTOMER, CUSTOMER_ACTION } from "../customer/customer.types";
import ErrorInterceptor from "../../exceptions/apiError";


// type T = {userId: string}

export type DB_INSERT_RESPONSE = UpdateResult | QueryError | ResultSetHeader | InsertOneResult | string | ErrorInterceptor
export type DB_SELECT_RESPONSE = any | RowDataPacket[] | QueryError | ErrorInterceptor

export type CUSTOMER_DB_CONSTRUCTOR = {
  databaseName: string
  collectionName: string // -> Customer OR Actions
  filter: any // -> search doc by filter
  updatedDoc?: any // -> data to update
}