const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { env } = require("~/config/environment")
const { CONNECT_DB } = require("~/config/database")
const { corsOptions } = require("~/config/cors")
const { errorHandlingMiddleware } = require("~/middlewares/errorHandlingMiddleware")
const routerV1 = require("~/routes/index")

const START_SERVER = () => {
  const app = express()
  const port = env.PORT || 8080
  const hostname = env.HOSTNAME

  app.use(cors(corsOptions))
  app.use(express.json())

  app.use(errorHandlingMiddleware)

  routerV1(app)

  app.listen(port, hostname, () => {
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