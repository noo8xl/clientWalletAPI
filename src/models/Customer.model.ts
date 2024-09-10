import { Schema, model } from 'mongoose'
import { CUSTOMER_SCHEMA } from '../schemas/Customer.schema'

type CUSTOMER = {
	_id?: string
	userEmail: string
	domainName: string
	companyName: string
	apiKey: string
	telegramId: number
	fiatName: any
	isActive: boolean
	createdAt: number
	updatedAt: number
}

const customer = new Schema<CUSTOMER>(CUSTOMER_SCHEMA, {collection: "Customer"})
export default model("Customer", customer)
