import Joi from "joi";
import { GET_DB } from "~/config/database";

const OTP_COLLECTION_NAME = "otps";
const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().min(5).max(50).trim().strict(),
  otp: Joi.string().required().min(6).max(255).trim().strict(),
  expireAt: Joi.date().default(() => new Date(Date.now() + 3 * 60 * 1000)),
  createAt: Joi.date().default(Date.now),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return OTP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

//  [POST] /otp/
const createOtp = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newOtp = await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .insertOne(validData);
    return newOtp;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /users/
const findOneByEmail = async (email, otp) => {
  try {
    // const currentTime = new Date();
    const res = await GET_DB().collection(OTP_COLLECTION_NAME).findOne({
      email: email,
      otp: otp,
      // expireAt: { $gt: currentTime }
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export const otpModel = {
  createOtp,
  findOneByEmail
};
