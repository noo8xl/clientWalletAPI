import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'node:http';
import router from './src/routes/index'
import { coinList, port, host } from './src/config/configs'
// import { ParserService } from './src/service/parser/parser.service'
import {AuthTelegram} from "./src/service/telegram/auth.telegram";

const app = express()
app.use('/static/', express.static(path.join(__dirname, + './' + 'static/')))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use((_req: express.Request, res: express.Response,  next: express.NextFunction) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
app.use(compression())
app.disable('x-powered-by')

// routers
app.use('/wallet-api', router)

// start balance parser & notification 
const bootstrap = async (): Promise<void> => {
  // let walletArr = []
  const authBot = new AuthTelegram()
  await authBot.messageInterceptor()

  // for (let i = 0; i <= coinList.length -1; i++) {
  //   let wt = new ParserService(coinList[i])
  //   wt.setParams()
  //   wt.getWalletListByParams()
  //   wt.getWalletBalances()
  //   walletArr.push(wt)
  // }
  // console.log('wt array len -> ', walletArr.length);
  // console.log("wt arr items -> ", walletArr);
  
  
  console.log(`Server is running on http://${host}:${port}/`)
}

const server = http.createServer(app)
server.listen(port)

server.on('listening', async (): Promise<void> => await bootstrap())
server.on("error", async (): Promise<void> => console.error("server error"))

