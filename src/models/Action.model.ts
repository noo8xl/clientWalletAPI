import { Schema, model } from 'mongoose'
import { CUSTOMER_ACTION_SCHEMA } from '../schemas/Action.schema'
import { CUSTOMER_ACTION } from '../types/customer/customer.types'

const actions = new Schema<CUSTOMER_ACTION>(CUSTOMER_ACTION_SCHEMA, {collection: "Actions"})
export default model("CustomerActions", actions)
