import { Schema } from 'mongoose'
import {CUSTOMER} from "../types/customer/customer.types";

export const CUSTOMER_SCHEMA = new Schema<CUSTOMER>({
  _id: Schema.Types.ObjectId,

	userEmail: { unique: true, type: String, require: true },
	companyName: { unique: true, type: String, require: true },
	domainName: { unique: true, type: String, require: true },
	},
	{
		collection: "Customer"
	}
)