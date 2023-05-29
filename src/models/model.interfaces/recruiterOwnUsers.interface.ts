import { Schema } from "mongoose";

export interface RECRUITER_OWN_USERS {
  staffEmail: string,
  staffFee: number,
  recruiterFee: number,
  recruiterId: Schema.Types.ObjectId
}