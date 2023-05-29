import { Schema, model } from 'mongoose'
import { RECRUITER_OWN_USERS_SCHEMA } from '../schemas/Recruiter_own_users.schema'
import { RECRUITER_OWN_USERS } from './model.interfaces/recruiterOwnUsers.interface'

const RecruiterOwnUsers = new Schema<RECRUITER_OWN_USERS>(RECRUITER_OWN_USERS_SCHEMA, {collection: "RecruiterOwnUsers"})
export default model('RecruiterOwnUsers', RecruiterOwnUsers)

