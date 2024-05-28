import { Schema } from 'mongoose'

export const CUSTOMER_ACTION_SCHEMA = {
  
  _id: Schema.Types.ObjectId,

  action: { type: String, require: true},
  status: { type: String, enum: ["success", "failed", "pending"], require: true },
  date: { type: Number, require: true},
  userId: { type: String, ref: "Customer", require: true }
}