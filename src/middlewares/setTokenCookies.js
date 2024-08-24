// Middleware để lưu token vào cookie sau khi passport xác thực thành công
const setTokenCookies = (req, res, next) => {
  console.log("req.user", req.user);
  if (req.user && req.user.accessToken && req.user.refreshToken) {
    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", req.user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });
  }
  next();
};

export default setTokenCookies;