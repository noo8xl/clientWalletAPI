import * as cors from 'cors'

export let CORS_OPTIONS: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Authorization',
    'AccessKey',
    'NameData'
  ],
  credentials: true,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  origin: true,
  preflightContinue: false,
}