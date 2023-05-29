import { Schema, model } from 'mongoose'
import { STAFF_PARAMS_SCHEMA } from '../schemas/Staff_params.schema'
import { STAFF_PARAMS } from './model.interfaces/staffParams.interface'

const StaffParams = new Schema<STAFF_PARAMS>(STAFF_PARAMS_SCHEMA, {collection: "StaffParams"})

export default model('StaffParams', StaffParams)
