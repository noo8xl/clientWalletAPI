import { Schema } from 'mongoose';

export const STAFF_WALLET_SCHEMA = {
  coinName: {
    type: String,
    require: true
  },
  walletAddress: {
    type: String,
    minlength: 40,
    maxlength: 50,
    require: true
  },
  staffTelegramId: {
    type: Number,
    require: true
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "BaseUserData",
    require: true
  }
}