import Joi from "joi";
import { GET_DB } from "~/config/database";
import { ObjectId } from "mongodb";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  firstName: Joi.string().required().min(3).max(50).trim().strict(),
  lastName: Joi.string().required().min(3).max(50).trim().strict(),
  avatar: Joi.string().trim().strict(),
  email: Joi.string().email().required().min(5).max(50).trim().strict(),
  password: Joi.string().min(6).max(255).trim().strict(),
  phone: Joi.string().min(10).max(15).trim(),
  typeAcc: Joi.string()
    .valid("google", "facebook", "local")
    .default("local")
    .required(),
  address: Joi.string().min(3).max(100).trim(),
  boardId: Joi.array().items(Joi.string()).default([]),
  access_token: Joi.string().optional().min(10).max(255).trim(),
  refresh_token: Joi.string().optional().min(10).max(255).trim(),

  createAt: Joi.date().default(Date.now),
  updateAt: Joi.date().allow(null).default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

// [GET] /users
const users = async () => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find();
    const listUser = await result.toArray();

    return listUser;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /users/:id
const userDetail = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(userId)
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//  [POST] /users/singUp
const createUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /users/:id
const findOneById = async (id) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /users/
const findOneByEmail = async (email, typeAcc) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email,
      typeAcc: typeAcc
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /users/
const findByEmail = async (email) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

// push boardId vào cuối mảng boardOrderIds
const pushBoardOrderIds = (board) => {
  try {
    const result = GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(board.ownerIds[0]) },
        { $push: { boardId: new ObjectId(board._id) } },
        { ReturnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// update cardOrderIds khi kéo thả card trong cùng 1 user
const update = (userId, updateData) => {
  try {
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        (id) => new ObjectId(id)
      );
    }

    const result = GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { ReturnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// delete user
const deleteOneById = (userId) => {
  try {
    const result = GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(userId) });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updatePassword = (data) => {
  try {
    const { email, password } = data;
    const result = GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email: email },
        { $set: { password: password } },
        { ReturnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  users,
  userDetail,
  createUser,
  findOneById,
  findOneByEmail,
  findByEmail,
  pushBoardOrderIds,
  update,
  deleteOneById,
  updatePassword,
};
