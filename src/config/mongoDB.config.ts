import dotenv from 'dotenv'
dotenv.config()
import { connect } from 'mongoose'

const URI: any = process.env.MONGO_URI

export const mongo = connect(URI)
  .then(() => {
    console.log('Successfully connected to mondoDB database')
  })
  .catch((e?: Error) => {
    console.log("database connection failed...")
    console.error(e)
    process.exit(1)
  })