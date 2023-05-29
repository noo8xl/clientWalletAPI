// import { Schema } from 'mongoose'

export const DOMAIN_SCHEMA = {
  fullDomainName: {
    type: String,
    require: true
  },
  domainName: {
    type: String,
    require: true
  },
  companyAddress: {
    type: String,
    require: true
  },
  companyPhoneNumber: {
    type: String,
    require: true
  },
  companyEmail: {
    type: String,
    require: true
  },
  companyOwnerName: {
    type: String,
    require: true
  },
  companyYear: {
    type: Number,
    min: 2001,
    max: 2021,
    require: true
  },
  companyCountry: {
    type: String,
    require: true
  },
  supportName: {
    type: String,
    require: true
  },
  domainOwner: {
    type: String,
    ref: 'BaseUserData',
    require: true
  }
}