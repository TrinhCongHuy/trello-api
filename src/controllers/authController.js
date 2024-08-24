import { StatusCodes } from "http-status-codes";
import { authService } from "~/services/authService";

// [POST] /users/sign-up
const createUser = async (dataRaw) => {
  try {
    const newUser = dataRaw;
    const result = await authService.createUser(newUser);

    return result
  } catch (error) {
    throw error;
  }
};

export const authController = {
  createUser
};
