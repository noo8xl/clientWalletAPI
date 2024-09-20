import { Schema } from 'mongoose'
import {ACTION} from "../types/action/Action.types";

export const CUSTOMER_ACTION_SCHEMA = new Schema<ACTION>({

		_id: Schema.Types.ObjectId,

		action: { type: String, required: true},
		date: { type: Number, required: true, default: Date.now() },
		customerId: { type: String, ref: "Customer", required: true }
	},
	{
		collection: "Actions"
	}
)