import express from 'express'
import compression from 'compression'
import router from './src/routes/index'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'node:http';
import validateAccessKey from './src/middlewares/accessKeyChecker'
import { port } from './src/config/configs'
import { host } from "./src/config/configs"
// import { balanceParser } from './services/crypto.lib/baseUsage/balanceParser'

const app = express()
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
server.listen(port, () => console.error(`Server is running on http://${host}:${port}/`)) 


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
