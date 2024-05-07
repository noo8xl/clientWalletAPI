import express, { Request, Response, NextFunction } from 'express'
const app = express()
require('dotenv').config()
import cors from 'cors'
import compression from 'compression'
import router from './src/routes/index'
import { CORS_OPTIONS } from './src/config/cors.config'
import * as helmet from "helmet";
import bodyParser from 'body-parser'
import path from 'path'
import http from 'node:http';
import validateAccessKey from './src/middlewares/accessKeyChecker'
// import { balanceParser } from './services/crypto.lib/baseUsage/balanceParser'

app.use('/static/', express.static(path.join(__dirname, + './' + '/static/')))

// add parser function with timeout <<<============

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(function (req: Request, res: Response,  next: NextFunction) {
//   res.setHeader('Content-Type', 'text/plain')
//   next()
// })
app.use(compression())
app.disable('x-powered-by')


// routers
app.use('/crypto', validateAccessKey, router)

const server = http.createServer(app)
const PORT: number = Number(process.env.PORT)
  
server.listen(PORT, () => console.error(`Server is running..`)) 


// auto payment
// + wallet generator
// + seed phrase generator
// + new database ** (local db was created (not cloud))
// + email api ** (fix template in sender name)

// wallet connect 

// ------------------------------------------------------------

//https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/


// https://www.npmjs.com/package/bitcoin

// https://github.com/sagivo/accept-bitcoin

// https://www.npmjs.com/package/bitcoinjs-lib#examples

// how to send btc nodejs 
// https://morioh.com/p/72511327f19f
// https://blog.logrocket.com/sending-bitcoin-with-javascript/
