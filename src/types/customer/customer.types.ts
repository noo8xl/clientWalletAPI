
type FIAT_NAME = "AUD" | "USD" | "EUR" |"RUB" |"AED"
type ACTION_STATUS = "success" | "rejected" | "pemding"

export type CUSTOMER = {
  userId?: string
  userEmail: string
  domainName: string
  companyName: string
  apiKey: string
  telegramId: number
  fiatName: FIAT_NAME
  isActive: boolean
  createdAt: number
  updatedAt: number 
}

export type CUSTOMER_ACTION = {
  userId: string
  date: number
  status: ACTION_STATUS
  action: string
}

