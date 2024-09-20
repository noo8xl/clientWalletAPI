import { model } from 'mongoose'
import {CUSTOMER_ACTION_SCHEMA} from "../schemas/Action.schema";

export default model("CustomerActions", CUSTOMER_ACTION_SCHEMA)
