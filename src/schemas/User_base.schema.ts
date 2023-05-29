
import { Schema } from 'mongoose'

export const USER_BASE_SCHEMA = {
  userName: {
    type: String || null,
    unique: true
  },
  avatar: {
    type: String || null,
    default: null
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activationLink: {
    type: String,
    required: true
  },
  registrationType: {
    type: String || Schema.Types.ObjectId,
    required: true
  },
  promocode: {
    type: String || null,
    required: false
  },
  domainName: {
    type: String,
    required: true
  },
  dateOfEntry: {
    type: Number,
    required: true
  }
}