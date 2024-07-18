import { ObjectId } from "mongodb";

const { GET_DB } = require("~/config/database")
const Joi = require("joi")

const ACCOUNT_COLLECTION_NAME = "cards";
const ACCOUNT_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  
  createAt: Joi.date().timestamp("javascript").default(Date.now),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Thực hiện kiểm tra dữ liệu trước khi tạo mới trong model
const validateBeforeCreate = async (data) => {
  return ACCOUNT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}



export const boardModel = {

};
