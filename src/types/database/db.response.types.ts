import { InsertOneResult } from "mongodb";
import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";


// type T = {userId: string}

export type DB_INSERT_RESPONSE = QueryError | ResultSetHeader | InsertOneResult | string
export type DB_SELECT_RESPONSE = RowDataPacket[] | QueryError

