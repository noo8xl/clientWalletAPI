import { Schema } from 'mongoose'

export interface DOMAIN_BASE {
  id?: string | Schema.Types.ObjectId
  fullDomainName: string
  domainName: string
  companyAddress: string
  companyPhoneNumber: string
  companyEmail: string
  companyOwnerName: string
  companyYear: number
  companyCountry: string
  supportName: string
  domainOwner: string | Schema.Types.ObjectId
}