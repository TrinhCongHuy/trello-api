import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"
import Joi from "joi"
import { GET_DB } from "~/config/database"
import { ObjectId } from "mongodb";

const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),  
  cardOrderIds: Joi.array().items(Joi.string()).default([]),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//  [POST] /columns/add-column
const addColumn = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    const newColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return newColumn
  } catch (error) {
    throw new Error(error)
  }
}

// [GET] /columns/:id
const findOneById = async (id) => {
  try {
    const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return column
  } catch (error) {
    throw new Error(error)
  }
}

// push columnId vào cuối mảng columnOrderIds
const pushCardOrderIds = (card) => {
  try {
    const result = GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { ReturnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  addColumn,
  findOneById,
  pushCardOrderIds
};
