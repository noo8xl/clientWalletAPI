
export const STAFF_PARAMS_SCHEMA = {
  paymentFee: {
    type: Number,
    require: true
  },
  supportName: {
    type: String,
    require: true
  },
  staffAccessDate: {
    type: Number,
    require: true
  },
  staffUserEmail: {
    type: String,
    require: true
  },
  receiveAccessFrom: {
    type: String,
    require: true
  }
}