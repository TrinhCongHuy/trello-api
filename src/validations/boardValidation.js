import ApiError from "~/utils/ApiError"

import Joi from "joi"
import { StatusCodes } from "http-status-codes"

const addBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Full Name is required.",
      "string.empty": "Full Name cannot be empty.",
      "string.trim": "Full Name must not have leading or trailing whitespace.",
    }),
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      'any.required': 'description is required.',
      'string.empty': 'description cannot be empty.',
      'string.trim': 'description must not have leading or trailing whitespace.'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  addBoard
}