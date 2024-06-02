import cors from 'cors';
import { config } from 'dotenv';
config();

// ============================================================================================================= //
// ############################################### base keys area ############################################## //
// ============================================================================================================= //

export const port = process.env.PORT;
export const host = process.env.HOST
export const apiUrl = process.env.API_URL;
// export const corsOpts: cors.CorsOptions = {....}


// ============================================================================================================= //
// ############################################# database keys area ############################################ //
// ============================================================================================================= //

export const MONGO_DB = {
  link: process.env.MONGO_DB_LINK,
  // userName: process.env.MONGO_DB_USER,
  // userPassword: process.env.MONGO_DB_PASSWORD,
  // databaseName: process.env.MONGO_DB_NAME,
}

export const REDIS_STORE = {
  url: process.env.REDIS_URL,
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // tls: true,
  // key: readFileSync('./redis_user_private.key'),
  // cert: readFileSync('./redis_user.crt'),
  // ca: [readFileSync('./redis_ca.pem')]
};

export const MYSQL_DB = {
  host: process.env.HOST,
  userName: process.env.MYSQL_DB_USER,
  userPassword: process.env.MYSQL_DB_PASSWORD,
  databaseName: process.env.MYSQL_DB_NAME,
}


// ============================================================================================================= //
// ########################################### notification keys area ########################################## //
// ============================================================================================================= //

export const NOTIFICATION_API_KEY: string | undefined = process.env.NOTIFICATION_API_KEY;
export const NOTIFICATION_ACCESS_TOKEN: string | undefined = process.env.X_ACCESS_TOKEN;
export const NOTIFICATION_API_PATH: string | undefined = process.env.NOTIFICATION_API_PATH;
export const ERR_CHAT_ID: string | undefined = process.env.ERROR_TELEGRAM_CHAT_ID;

// ============================================================================================================= //
// ########################################### crypto api keys area ############################################ //
// ============================================================================================================= //

export const TRON_API_KEY: string | undefined = process.env.TRON_API_KEY;
export const ETH_KEY: string | undefined = process.env.ETH_API_KEY;
export const SOL_KEY: string | undefined = process.env.SOLANA_API_KEY;

export const CORS_OPTIONS: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Authorization',
  ],
  credentials: true,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  origin: true,
  preflightContinue: false,
}

// ============================================================================================================= //
// ############################################## variables area ############################################### //
// ============================================================================================================= //


export const coinList: string[] = [ 'btc', 'eth', 'trx', 'ton', 'sol' ]

export const availableCoins = [
  { coinName: 'btc', coinApiName: 'bitcoin' },
  { coinName: 'eth', coinApiName: 'ethereum' },
  { coinName: 'trx', coinApiName: 'tron' },
  { coinName: 'ton', mainAddress: 'the-open-network' },
  { coinName: 'sol', coinApiName: 'solana' },
  // { coinName: 'bch', coinApiName: 'bitcoin-cash' },
  // { coinName: 'usdt', coinApiName: 'tether' },
  // { coinName: 'trx/usdt',coinApiName: 'tron' },
]

export const OWNER_WALLET_LIST = [
  { coinName: 'btc', mainAddress: process.env.MAIN_BTC_WALLET },
  { coinName: 'eth', mainAddress: process.env.MAIN_ETH_WALLET },
  { coinName: 'trx', mainAddress: process.env.MAIN_TRX_WALLET },
  { coinName: 'ton', mainAddress: process.env.MAIN_TON_WALLET },
  { coinName: 'sol', mainAddress: process.env.MAIN_SOL_WALLET },
  // { coinName: 'usdt', mainAddress: process.env.MAIN_USDT_WALLET },
  // { coinName: 'bch', mainAddress: process.env.MAIN_BCH_WALLET },
  // { coinName: 'trx/usdt', mainAddress: process.env.MAIN_TRX_USDT_WALLET },
]