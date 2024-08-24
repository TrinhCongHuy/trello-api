import { userService } from "~/services/userService";
import { StatusCodes } from "http-status-codes";
import ms from "ms"
import ApiError from "~/utils/ApiError";


// [GET] /users/
const users = async (req, res, next) => {
  try {
    const listUser = await userService.users();

    res.status(StatusCodes.OK).json(listUser);
  } catch (error) {
    next(error);
  }
};


// [GET] /users/:id
const userDetail = async (req, res, next) => {
  try {
    const userId = req.params.id
    const result = await userService.userDetail(userId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] /users/sign-up
const singUp = async (req, res, next) => {
  try {
    const newUser = req.body;
    newUser.typeAcc = 'local'
    const user = await userService.singUp(newUser);

    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

// [POST] /users/sign-in
const signIn = async (req, res, next) => {
  try {
    const data = req.body;
    data.typeAcc = 'local'
    const result = await userService.signIn(data);

    const { account, accessToken, refreshToken } = result;
  
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({
      ...account,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
};

const refreshToken = async (req, res) => {
  try {
    // Lấy refreshToken từ cookies
    const refreshTokenFromCookie = req.cookies?.refreshToken

    const result = await userService.refreshToken(refreshTokenFromCookie)
    const { accessToken } = result

    // Lưu accessToken vào cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh Token API failed.' })
  }
}

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

// [GET] /users/:id
const detailUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.detailUser(userId);

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

// [PUT] /users/:id
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);

    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// [PUT] /users/supports/moving_card
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await userService.moveCardToDifferentColumn(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] /users/forgot-password/email
const ForgotPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const result = await userService.ForgotPasswordEmail(email);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] /users/forgot-password/email
const ForgotPasswordVerifyOtp = async (req, res, next) => {
  try {
    const result = await userService.ForgotPasswordVerifyOtp(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] /users/forgot-password/email
const ForgotPasswordReset = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Passwords do not match');
    }
    const result = await userService.ForgotPasswordReset(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  users,
  userDetail,
  singUp,
  signIn,
  logout,
  refreshToken,
  detailUser,
  updateUser,
  moveCardToDifferentColumn,
  ForgotPasswordEmail,
  ForgotPasswordVerifyOtp,
  ForgotPasswordReset
};
