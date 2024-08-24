import { userModel } from "~/models/userModel";
import { JWTProvider } from "~/providers/JwtProvider";
import 'dotenv/config'

// [POST] /users/
const createUser = async (data) => {
  try {
    const { email, typeAcc } = data;
    let user = await userModel.findOneByEmail(email, typeAcc);

    if (!user) {
      const createUserResult = await userModel.createUser(data);
      user = await userModel.findOneById(createUserResult.insertedId.toString());
    }

    const userInfo = {
      id: user._id,
      email: user.email,
    };

    const accessToken = await JWTProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      15
    );
    const refreshToken = await JWTProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const authService = {
  createUser,
};
