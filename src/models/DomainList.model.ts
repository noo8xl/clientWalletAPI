import { Schema, model } from 'mongoose'
import { DOMAIN_SCHEMA } from '../schemas/Domain_list.schema'
import { DOMAIN_BASE } from './model.interfaces/domainBase.interface'

const DomainList = new Schema<DOMAIN_BASE>(DOMAIN_SCHEMA, {collection: "DomainList"})
export default model('DomainList', DomainList)
