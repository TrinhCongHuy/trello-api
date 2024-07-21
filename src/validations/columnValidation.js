import ApiError from "~/utils/ApiError"

import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"

const addColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Full Name is required.",
      "string.empty": "Full Name cannot be empty.",
      "string.min": "Full Name must be at least 3 characters long.",
      "string.max": "Full Name must be at most 50 characters long.",
      "string.trim": "Full Name must not have leading or trailing whitespace.",
    }) 
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
  })

  try {
    await correctCondition.validateAsync(req.body, { 
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const columnValidation = {
  addColumn,
  update
}