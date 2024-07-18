import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"

const { boardModel } = require("~/models/boardModel")
const { slugify } = require("~/utils/formatters")

// [GET] /boards/
const boards = async () => {
  try {
    const boards = await boardModel.boards()
    return boards
  } catch (error) {
    throw error
  }
}

// [POST] /boards/add-board
const addBoard = async (data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title),
    }

    const createBoard = await boardModel.addBoard(newBoard)
    const board = await boardModel.findOneById(
      createBoard.insertedId.toString()
    )
    return board
  } catch (error) {
    throw error
  }
}

// [GET] /boards/:id
const detailBoard = async (boardId) => {
  try {
    const board = await boardModel.getDetail(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  boards,
  addBoard,
  detailBoard
}
