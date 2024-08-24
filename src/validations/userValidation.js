import ApiError from "~/utils/ApiError";

import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const singUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "FirstName is required.",
      "string.empty": "FirstName cannot be empty.",
      "string.min": "FirstName must be at least 3 characters long.",
      "string.max": "FirstName must be at most 50 characters long.",
      "string.trim": "FirstName must not have leading or trailing whitespace.",
    }),
    lastName: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "LastName is required.",
      "string.empty": "LastName cannot be empty.",
      "string.min": "LastName must be at least 3 characters long.",
      "string.max": "LastName must be at most 50 characters long.",
      "string.trim": "LastName must not have leading or trailing whitespace.",
    }),
    email: Joi.string()
      .email()
      .required()
      .min(5)
      .max(50)
      .trim()
      .strict()
      .messages({
        "any.required": "Email is required.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email cannot be empty.",
        "string.min": "Email must be at least 5 characters long.",
        "string.max": "Email must be at most 50 characters long.",
        "string.trim": "Email must not have leading or trailing whitespace.",
      }),
    phone: Joi.string().required().min(10).max(15).trim().strict().messages({
      "any.required": "Phone number is required.",
      "string.empty": "Phone number cannot be empty.",
      "string.min": "Phone number must be at least 10 characters long.",
      "string.max": "Phone number must be at most 15 characters long.",
      "string.trim":
        "Phone number must not have leading or trailing whitespace.",
    }),
    password: Joi.string().required().min(6).max(50).trim().strict().messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 50 characters long.",
      "string.trim": "Password must not have leading or trailing whitespace.",
    }),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const signIn = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .min(5)
      .max(50)
      .trim()
      .strict()
      .messages({
        "any.required": "Email is required.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email cannot be empty.",
        "string.min": "Email must be at least 5 characters long.",
        "string.max": "Email must be at most 50 characters long.",
        "string.trim": "Email must not have leading or trailing whitespace.",
      }),
    password: Joi.string().required().min(6).max(50).trim().strict().messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 50 characters long.",
      "string.trim": "Password must not have leading or trailing whitespace.",
    }),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(
      // new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
      // error
    );
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(255).trim().strict(),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const userValidation = {
  singUp,
  signIn,
  update,
  moveCardToDifferentColumn,
};
