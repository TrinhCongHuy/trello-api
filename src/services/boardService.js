import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"

import { boardModel } from "~/models/boardModel"
import { slugify } from "~/utils/formatters"
import { cloneDeep } from "lodash"

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

    const resBoard = cloneDeep(board)
    
    // Lặp qua all các columns của board và gán all card có _id === columnId 
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    });

    // Sau khi gán xong thì xoá cards ở bên ngoài
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  boards,
  addBoard,
  detailBoard
}
