import { Schema, model } from 'mongoose'
import { RECRUITER_WALLET_SCHEMA } from '../schemas/Recruiter_wallet.schema'
import { RECRUITER_WALLET } from './model.interfaces/recruiterWallet.interface'

const RecruiterWallet = new Schema<RECRUITER_WALLET>(RECRUITER_WALLET_SCHEMA, {collection: "RecruiterWallet"})
export default model('RecruiterWallet', RecruiterWallet)
