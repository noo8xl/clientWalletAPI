import { Schema, model } from 'mongoose'
import { CUSTOMER_ACTION_SCHEMA } from '../schemas/Action.schema'

type CUSTOMER_ACTION = {
	userId: any
	date: number
	status: any
	action: string
}

const actions = new Schema<CUSTOMER_ACTION>(CUSTOMER_ACTION_SCHEMA, {collection: "Actions"})
export default model("CustomerActions", actions)
