import { ObjectId } from "mongodb";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";
import { GET_DB } from "~/config/database"
import Joi from "joi"

const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  slug: Joi.string().required().min(3).max(50).trim().strict(),
  type: Joi.string().valid('public', 'private').default('private'),
  ownerId: Joi.string(),
  memberIds: Joi.array().items(Joi.string()).default([]),
  columnOrderIds: Joi.array().items(Joi.string()).default([]),

  createAt: Joi.date().timestamp("javascript").default(Date.now), 
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// [GET] /boards/
const boards = async (userId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find({
      ownerId: new ObjectId(userId)
    })
    const listBoard = await result.toArray()

    return listBoard
  } catch (error) {
    throw new Error(error)
  }
};

//  [POST] /boards/add-board
const addBoard = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    validData.ownerId = new ObjectId(data.ownerId)

    const newBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return newBoard
  } catch (error) {
    throw new Error(error)
  }
}

// Add member to board
const addMember = async (boardId, userId, userInviteId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId), ownerId: new ObjectId(userId) },
      { $addToSet: { memberIds: new ObjectId(userInviteId) } },
      { returnDocument: 'after' }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// [GET] /boards/:id
const findOneById = async (id) => {
  try {
    const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return board
  } catch (error) {
    throw new Error(error)
  }
}

// [GET] /boards/:id
const getDetail = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { 
        $match: 
          {
            _id: new ObjectId(id),
            _destroy: false
          } 
      },
      {
        $lookup:
          {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
      },
      {
        $lookup:
          {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// push columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = (column) => {
  try {
    const result = GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

// update columnOrderIds khi kéo thả column
const update = (boardId, updateData) => {
  try {
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(id => new ObjectId(id))
    }

    const result = GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { ReturnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

// pull columnId vào cuối mảng columnOrderIds
const pullColumnOrderIds = (column) => {
  try {
    const result = GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { ReturnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  boards,
  addBoard,
  addMember,
  findOneById,
  getDetail,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
};
