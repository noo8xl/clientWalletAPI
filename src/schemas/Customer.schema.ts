import { Schema } from 'mongoose'
import {FIAT_NAME} from "../entity/customer/FiatName";

export const CUSTOMER_SCHEMA = {
  _id: Schema.Types.ObjectId,

	userEmail: { unique: true, type: String, require: true },
	companyName: { unique: true, type: String, require: true },
	domainName: { unique: true, type: String, require: true },
	apiKey: { unique: true, type: String, require: true },
	isActive: { type: Boolean, require: true },
	fiatName: {
		enum: FIAT_NAME,
		type: String,
		require: true,
	},
	telegramId: { unique: true, type: Number, require: true },
	createdAt: { type: Number, require: true },
	updatedAt: { type: Number, require: true },




}



