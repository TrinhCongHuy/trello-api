const { GET_DB } = require("~/config/database")
const Joi = require("joi")

const ACCOUNT_COLLECTION_NAME = "boards";
const ACCOUNT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().trim().strict(),
  description: Joi.string().required().trim().strict(),
  type: Joi.string().valid('public', 'private').required().trim().strict(),
  ownerIds: Joi.array().items(Joi.string()).required(),
  memberIds: Joi.array().items(Joi.string()).required(), 
  columnOrderIds: Joi.array().items(Joi.string()).required(),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return ACCOUNT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const boards = async () => {
  try {
    const result = await GET_DB().collection(ACCOUNT_COLLECTION_NAME).find()
    const listBoard = await result.toArray()

    return listBoard
  } catch (error) {
    throw new Error(error)
  }
};

export const boardModel = {
  boards,
};
