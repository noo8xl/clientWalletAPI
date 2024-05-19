
type FIAT_NAME = "AUD" | "USD" | "EUR" |"RUB" |"AED"

export type CUSTOMER = {
  userId?: string
  userEmail: string
  domainName: string
  companyName: string
  apiKey: string
  telegramId: number
  fiatName: FIAT_NAME
  createdAt: number
  updatedAt: number 
}

export type CUSTOMER_ACTION = {
  userId: string
  date: number
  // shoul update 
}
