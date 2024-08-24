import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"

import { boardModel } from "~/models/boardModel"
import { slugify } from "~/utils/formatters"
import { cloneDeep } from "lodash"
import { columnModel } from "~/models/columnModel"
import { cardModel } from "~/models/cardModel"
import { userModel } from "~/models/userModel"

// [GET] /boards/
const boards = async (userId) => {
  try {
    const boards = await boardModel.boards(userId)
    return boards
  } catch (error) {
    throw error
  }
}

// [POST] /boards/add-board
const addBoard = async (newBoard, userId) => {
  try {
  
    const dataNewBoard = {
      ...newBoard,
      ownerId: userId,
      slug: slugify(newBoard.title),
    }

    const createBoard = await boardModel.addBoard(dataNewBoard)
    const board = await boardModel.findOneById(
      createBoard.insertedId.toString()
    )

    if (board) {
      await userModel.pushBoardOrderIds(board)
    }

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

// [PUT] /boards/:id
const updateBoard = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const board = await boardModel.update(boardId, updateData)
    return board
  } catch (error) {
    throw error
  }
}

// [PUT] /boards/:id
const addUserToBoard = async (boardId, userId, userInviteId) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const board = await boardModel.addMember(boardId, updateData)
    return board
  } catch (error) {
    throw error
  }
}

// [PUT] /boards/supports/moving_card
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Cập nhật mảng orderCardIds của column ban đầu => xoá id của cái card bị kéo ra khỏi cardOrderIds của column đó
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // Cập nhật mảng orderCardIds của column ban sau => thêm id của cái card bị kéo ra vào cardOrderIds của column đó
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // Cập nhật columnId của cái card bị kéo đổi id của column ban đầu thành id của column sau 
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updateResult: 'SuccessFully!' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  boards,
  addBoard,
  detailBoard,
  updateBoard,
  addUserToBoard,
  moveCardToDifferentColumn
}
