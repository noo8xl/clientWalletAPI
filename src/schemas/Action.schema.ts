import { Schema } from 'mongoose'
import {ACTION_STATUS} from "../entity/action/ActionStatus";

export const CUSTOMER_ACTION_SCHEMA = {

  _id: Schema.Types.ObjectId,

  action: { type: String, require: true},
  status: { type: String, enum: ACTION_STATUS, require: true },
  date: { type: Number, require: true},
  userId: { type: String, ref: "Customer", require: true }
}