import { config } from 'dotenv';
config();

// ============================================================================================================= //
// ############################################### base keys area ############################################## //
// ============================================================================================================= //

export const port = process.env.PORT;
export const apiUrl = process.env.API_URL;
// export const corsOpts: cors.CorsOptions = {....}


// ============================================================================================================= //
// ############################################# database keys area ############################################ //
// ============================================================================================================= //


export const MYSQL_HOST: string | undefined = process.env.HOST;
export const MYSQL_DB_USER: string | undefined = process.env.MYSQL_DB_USER;
export const MYSQL_PWD: string | undefined = process.env.MYSQL_DB_PASSWORD;
export const MYSQL_DB_NAME: string | undefined = process.env.MYSQL_DB_NAME;

// ============================================================================================================= //
// ########################################### nitification keys area ########################################## //
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

