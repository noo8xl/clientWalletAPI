import { Schema } from "mongoose"

export interface STAFF_WALLET {
  coinName: string
  walletAddress: string
  staffTelegramId: number
  staffId: Schema.Types.ObjectId
}