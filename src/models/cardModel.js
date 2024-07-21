import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"
import Joi from "joi"
import { GET_DB } from "~/config/database"
import { ObjectId } from "mongodb"


const CARD_COLLECTION_NAME = "cards"
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  
  createAt: Joi.date().timestamp("javascript").default(Date.now),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
})

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

//  [POST] /cards/add-card
const addCard = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    const newCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return newCard
  } catch (error) {
    throw new Error(error)
  }
}

// [GET] /cards/:id
const findOneById = async (id) => {
  try {
    const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return card
  } catch (error) {
    throw new Error(error)
  }
}

// update columnId khi kéo thả card từ column này sang column khác
const update = (cardId, updateData) => {
  try {
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    const result = GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { ReturnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  addCard,
  findOneById,
  update
}
