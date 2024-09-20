
import { model } from 'mongoose'
import {CUSTOMER_PARAMS_SCHEMA} from "../schemas/CustomerParams.schema";
import {CUSTOMER_PARAMS} from "../types/customer/customer.types";

export default model<CUSTOMER_PARAMS>("CustomerParams", CUSTOMER_PARAMS_SCHEMA)
