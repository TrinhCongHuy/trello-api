import express from "express"
import cors from "cors"
import http from 'http'
import 'dotenv/config'
import { env } from "~/config/environment"
import { CONNECT_DB } from "~/config/database"
import { corsOptions } from "~/config/cors"
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { API_V1 } from './routes'
import cookieParser from 'cookie-parser'
import '~/config/passport'
// import initSocket from '~/providers/Socket'
import { io } from "./providers/Socket"


const START_SERVER = () => {
  const app = express()
  const server = http.createServer(app)
  const port = env.PORT || 8080
  const hostname = env.HOSTNAME

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use(express.json())

  // global._io = io
  // initSocket(server)
  io.attach(server)

  API_V1(app)

  app.use(errorHandlingMiddleware)

  server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`)
  })
}

(async () => {
  try {
    console.log("Connecting to mongoDB...")
    CONNECT_DB()
    console.log("Connected mongoDB")

    START_SERVER()
  } catch (error) {
    process.exit(0)
  }
})()