import { model } from 'mongoose'
import { CUSTOMER_SCHEMA } from '../schemas/Customer.schema'

export default model("Customer", CUSTOMER_SCHEMA)
