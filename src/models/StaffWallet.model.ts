import { Schema, model } from 'mongoose'
import { STAFF_WALLET_SCHEMA } from '../schemas/staff_wallet.schema'
import { STAFF_WALLET } from './model.interfaces/staffWallet.interface'

const staffWallet = new Schema<STAFF_WALLET>(STAFF_WALLET_SCHEMA, {collection: "StaffWallet"})
export default model('StaffWallet', staffWallet)
