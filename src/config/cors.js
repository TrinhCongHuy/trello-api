const { WHITELIST_DOMAINS } = require('~/utils/constants') 
const { env } = require('~/config/environment') 
const { StatusCodes } = require('http-status-codes') 
const ApiError = require('~/utils/ApiError') 

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  optionsSuccessStatus: 200,
  credentials: true
}