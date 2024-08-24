import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/database";

const INVITE_COLLECTION_NAME = "invites";
const INVITE_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required(),
  invitedBy: Joi.string().required(),
  invitedUserEmail: Joi.string().email().required(),
  isAccept: Joi.boolean().default(false),
  isReading: Joi.boolean().default(false),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return INVITE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

//  [POST] /invites/add-invite
const addInvite = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newInviteToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      invitedBy: new ObjectId(validData.invitedBy),
    };

    const newInvite = await GET_DB()
      .collection(INVITE_COLLECTION_NAME)
      .insertOne(newInviteToAdd);
    return newInvite;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /invites/:id
const findOneById = async (id) => {
  try {
    const invite = await GET_DB()
      .collection(INVITE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return invite;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /invites
const findOneByEmail = async (email, isReading) => {
  try {
    const result = await GET_DB().collection(INVITE_COLLECTION_NAME).find({
      invitedUserEmail: email,
      isReading: isReading
    });
    const invites = await result.toArray();

    return invites;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /invites/:id
const findInvite = async (boardId, email) => {
  try {
    const invite = await GET_DB()
      .collection(INVITE_COLLECTION_NAME)
      .findOne({
        boardId: new ObjectId(boardId),
        invitedUserEmail: email,
      });
    return invite;
  } catch (error) {
    throw new Error(error);
  }
};

// update invite
const update = (inviteId, email, updateData) => {
  try {
    const result = GET_DB()
      .collection(INVITE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(inviteId), invitedUserEmail: email },
        { $set: updateData },
        { ReturnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const inviteModel = {
  addInvite,
  findOneById,
  findInvite,
  findOneByEmail,
  update,
};
