
import { SolanaService } from "../../service/wallet/solana.service"
import { BitcoinService } from "../../service/wallet/bitcoin.service"
import { EthereumService } from "../../service/wallet/ethereum.service"
import { TheOpenNetworkService } from "../../service/wallet/theOpenNetwork.service"
import { TronService } from "../../service/wallet/tron.service"


export enum FIAT_NAME {
	AUD, USD, EUR, RUB, AED
}


// type COIN_NAME_LIST = "btc" | "etc" | "trx" | "ton" | "sol"
export enum COIN_NAME_LIST {
	BTC, ETC, TRX, TON, SOL
}

export type WALLET_KEYS = {
	public: any
	private: any
}



type BITCOIN_WALLET = {
  userId: string
  coinName: string
  address: string
  privateKey: string // Buffer -> available str value with toString()
  publicKey: string // Buffer ->  available str value with toString()
  seedPhrase?: string // Buffer ->  available str value with toString()
  mnemonic?: string
  // isUsed: boolean // if wallet has balance
  // isChecked: boolean // if wallet was checked by balance parser 
  balance: number
}

type ETHEREUM_WALLET = {
  userId: string
  coinName: string
  address: string
  privateKey: string
  publicKey: string
  seedPhrase?: string // Buffer ->  available str value with toString()
  mnemonic?: string
  balance: number
}

type TRON_WALLET = {
  userId: string
  coinName: string
  address: string
  privateKey: string
  publicKey: string
  seedPhrase?: string // Buffer ->  available str value with toString()
  mnemonic?: string
  balance: number
}

type THEOPENNETWORK_WALLET = {
  userId: string
  coinName: string
  address: string
  privateKey: string // Buffer -> available str value with toString()
  publicKey: string // Buffer ->  available str value with toString()
  seedPhrase?: string // Buffer ->  available str value with toString()
  mnemonic?: string
  balance: number
}

type SOLANA_WALLET = {
  userId: string
  coinName: string
  address: string
  privateKey: string //  Uint8Array -> available str value with toString()
  publicKey: string //  PublicKey -> available str value with toString()
  seedPhrase?: string // Buffer ->  available str value with toString()
  mnemonic?: string
  balance: number
}

// type COIN_NAME_LIST = "btc" | "etc" | "trx" | "ton" | "sol"
export type WALLET_LIST = {
  id: number
  coinName: string
  address: string
  balance: number
  userId: string
  publicKey: string
  privateKey: string
  isUsed: boolean
  isChecked: boolean
}

export type WALLET = BITCOIN_WALLET | ETHEREUM_WALLET | THEOPENNETWORK_WALLET | TRON_WALLET | SOLANA_WALLET ;
export type WALLET_TYPE = BitcoinService | TronService | TheOpenNetworkService | EthereumService | SolanaService ;

export type RATE_DATA = {
  coinName: string
  fiatName: string
  coinBalance: number
  fiatValue: number
}
