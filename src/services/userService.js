import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

import { userModel } from "~/models/userModel";
import { cloneDeep } from "lodash";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import bcrypt from "bcrypt";
import 'dotenv/config'
import { JWTProvider } from "~/providers/JwtProvider";
import { otpModel } from "~/models/otpModel";
import { sendMail } from "~/providers/SendMail";
import { generateRandomNumber } from "~/providers/Generate";

// [GET] /users/
const users = async () => {
  try {
    const users = await userModel.users();
    return users;
  } catch (error) {
    throw error;
  }
};

// [GET] /users/:id
const userDetail = async (userId) => {
  try {
    const result = await userModel.userDetail(userId);
    return result;
  } catch (error) {
    throw error;
  }
};

// [POST] /users/sign-up
const singUp = async (data) => {
  try {
    const { email, password, typeAcc } = data;
    const exitEmail = await userModel.findOneByEmail(email, typeAcc);

    if (exitEmail) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newData = { ...data, password: hashedPassword };

    const createUser = await userModel.createUser(newData);
    const user = await userModel.findOneById(createUser.insertedId.toString());

    return user;
  } catch (error) {
    throw error;
  }
};

// [POST] /users/signIn
const signIn = async (data) => {
  try {
    const { email, password, typeAcc } = data;
    const account = await userModel.findOneByEmail(email, typeAcc);

    if (!account) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    }

    const userInfo = {
      id: account._id,
      email: account.email
    }

    const passwordMatch = bcrypt.compareSync(password, account.password);
    if (!passwordMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect password. Please try again.');
    }

    const accessToken = await JWTProvider.generateToken(userInfo, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, 15)
    const refreshToken = await JWTProvider.generateToken(userInfo, process.env.REFRESH_TOKEN_SECRET_SIGNATURE, '14 days')

    return {
      account,
      accessToken,
      refreshToken
    };
  } catch (error) {
    throw error;
  }
};

// [PUT] /users/refreshToken
const refreshToken = async (token) => {
  try {
    // Verify token
    const refreshTokenDecoded = await JWTProvider.verifyToken(
      token,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email
    }

    // Tạo mới accessToken
    const accessToken = await JWTProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      60
    )

    return {
      accessToken
    };
  } catch (error) {
    throw error;
  }
};

// [GET] /users/:id
const detailUser = async (userId) => {
  try {
    const user = await userModel.getDetail(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const resUser = cloneDeep(user);

    // Lặp qua all các columns của user và gán all card có _id === columnId
    resUser.columns.forEach((column) => {
      column.cards = resUser.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    // Sau khi gán xong thì xoá cards ở bên ngoài
    delete resUser.cards;

    return resUser;
  } catch (error) {
    throw error;
  }
};

// [PUT] /users/:id
const updateUser = async (userId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const user = await userModel.update(userId, updateData);
    return user;
  } catch (error) {
    throw error;
  }
};

// [PUT] /users/supports/moving_card
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Cập nhật mảng orderCardIds của column ban đầu => xoá id của cái card bị kéo ra khỏi cardOrderIds của column đó
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });

    // Cập nhật mảng orderCardIds của column ban sau => thêm id của cái card bị kéo ra vào cardOrderIds của column đó
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });

    // Cập nhật columnId của cái card bị kéo đổi id của column ban đầu thành id của column sau
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now(),
    });

    return { updateResult: "SuccessFully!" };
  } catch (error) {
    throw error;
  }
};

// [POST] /users/forgot-password/email
const ForgotPasswordEmail = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    }

    const otp = generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    
    await otpModel.createOtp(objectForgotPassword)

    const subject = "Mã OTP xác minh lấy lại mật khẩu!"
    const html = `Mã OTP lấy lại mật khẩu là ${otp}. Thời hạn sử dụng là 3 phút. Lưu ý: Không để lộ mã OTP.`

    sendMail(email, subject, html)

    return user;
  } catch (error) {
    throw error;
  }
};

// [POST] /users/
const ForgotPasswordVerifyOtp = async (data) => {
  try {
    const { email, otp } = data
    const result = await otpModel.findOneByEmail(email, otp);
    if (result == null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "OTP not found or expired.");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// [POST] /users/
const ForgotPasswordReset = async (data) => {
  try {
    const { newPassword } = data
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const newData = { ...data, password: hashedPassword };

    const result = await userModel.updatePassword(newData);
    if (result == null) {
      throw new ApiError(StatusCodes.NOT_FOUND, "OTP not found or expired.");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  users,
  userDetail,
  singUp,
  signIn,
  refreshToken,
  detailUser,
  updateUser,
  moveCardToDifferentColumn,
  ForgotPasswordEmail,
  ForgotPasswordVerifyOtp,
  ForgotPasswordReset
};
