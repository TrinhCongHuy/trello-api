import { StatusCodes } from 'http-status-codes'
import 'dotenv/config'
import { JWTProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken từ cookies
  const accessTokenFromCookie = req.cookies?.accessToken

  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Token not found)' })
    return
  }

  try {
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessTokenFromCookie,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    req.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    console.log("error", error);
    // Trường hợp accessToken hết hạn thì trả về mã lỗi 410 cho FE
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
      return
    }

    // Trong các trường hợp khác thì trả về mã 401 cho FE
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Please login!' })
  }
}

export const authMiddleware = {
  isAuthorized
}
