import { Schema, model } from 'mongoose'
import { CUSTOMER_SCHEMA } from '../schemas/Customer.schema'
import { CUSTOMER } from '../types/customer/customer.types'

const customer = new Schema<CUSTOMER>(CUSTOMER_SCHEMA, {collection: "Customer"})
export default model("Customer", customer)
