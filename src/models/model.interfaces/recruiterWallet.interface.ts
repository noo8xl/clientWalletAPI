import { Schema } from "mongoose"

export interface RECRUITER_WALLET {
  coinName: string
  walletAddress: string
  recruiterId: Schema.Types.ObjectId
}