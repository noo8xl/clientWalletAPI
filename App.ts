import express from 'express'
import compression from 'compression'
import router from './src/routes/index'
import bodyParser from 'body-parser'
import path from 'path'
import http from 'node:http';
import { port } from './src/config/configs'
import { host } from "./src/config/configs"

const app = express()
app.use('/static/', express.static(path.join(__dirname, + './' + 'static/')))

// add parser function with timeout <<<============

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

const server = http.createServer(app)
server.listen(port, () => console.error(`Server is running on http://${host}:${port}/`))
server.on("error", async () => {

})

