import { Schema, model } from 'mongoose'
import { USER_BASE_SCHEMA } from '../schemas/User_base.schema'
import { USER_BASE } from './model.interfaces/userBase.interface' 

const UserBaseData = new Schema<USER_BASE>(USER_BASE_SCHEMA, {collection:  'BaseUserData'})
export default model('BaseUserData', UserBaseData)
