import { Schema } from 'mongoose'

export const RECRUITER_OWN_USERS_SCHEMA = {
  staffEmail: {
    type: String,
    require: true
  },
  staffFee: {
    type: Number,
    require: true
  },
  recruiterFee: {
    type: Number,
    require: true
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    require: true
  }
}