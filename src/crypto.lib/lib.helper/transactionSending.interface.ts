

export interface TRANSACTION_SENDING_DATA {
  ownerWallet: string
  developersWallet: string
  coFounderWallet: string
  staffWallet: string
  recruiterWallet?: string 
  ownerSum: number
  developersSum: number
  coFounderSum: number
  staffSum: number
  recruiterSum?: number
  coinName: string
  fullSum: boolean
  telegramId: number
}

export interface OWNER_TRANSACTION_SENDING_DATA {
  ownerWallet: string
  coinName: string
  ownerSum: number
  fullSum: boolean
  telegramId: number
}

