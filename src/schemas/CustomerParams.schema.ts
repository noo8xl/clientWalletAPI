import { Schema } from 'mongoose'
import {FIAT_NAME} from "../types/wallet/wallet.types";
import {CUSTOMER_PARAMS} from "../types/customer/customer.types";

export const CUSTOMER_PARAMS_SCHEMA = new Schema<CUSTOMER_PARAMS>({
	_id: Schema.Types.ObjectId,

	apiKey: { unique: true, type: String },
	isActive: { type: Boolean, required: true, default: true },
	fiatName: {
		enum: Object.values(FIAT_NAME),
		type: String as any,
		required: true,
		default: FIAT_NAME.USD,
	},
	telegramId: { unique: true, type: Number, required: true },
	createdAt: { type: Number, required: true, default: Date.now() },
	updatedAt: { type: Number, required: true, default: Date.now() },
	customerId: { unique: true, type: String, required: true, ref: "Customer" },
	},
	{
		collection: "CustomerParams"
	}
)
