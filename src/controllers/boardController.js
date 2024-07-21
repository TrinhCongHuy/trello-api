const { boardService } = require("~/services/boardService")
const { StatusCodes } = require("http-status-codes")

// [GET] /boards/
const boards = async (req, res, next) => {
  try {
    const listBoard = await boardService.boards()

    res.status(StatusCodes.OK).json(listBoard)
  } catch (error) {
    next(error)
  }
};

// [POST] /boards/add-board
const addBoard = async (req, res, next) => {
  try {
    const newBoard = req.body
    const board = await boardService.addBoard(newBoard)

    res.status(StatusCodes.CREATED).json(board)
  } catch (error) {
    next(error)
  }
};

// [GET] /boards/:id
const detailBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.detailBoard(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
};

// [PUT] /boards/:id
const updateBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.updateBoard(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
};

// [PUT] /boards/supports/moving_card
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result) 
  } catch (error) {
    next(error)
  }
};

export const boardController = {
  boards,
  addBoard,
  detailBoard,
  updateBoard,
  moveCardToDifferentColumn
};
