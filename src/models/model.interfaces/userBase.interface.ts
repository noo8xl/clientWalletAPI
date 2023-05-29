import { Schema } from "mongoose"

export interface USER_BASE {
  _id?: string | Schema.Types.ObjectId
  userName: string | null
  avatar: string | null
  userEmail: string
  password: string
  activationLink: string
  registrationType: string | Schema.Types.ObjectId
  promocode: string | null
  domainName: string
  dateOfEntry: number
}