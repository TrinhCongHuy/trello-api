const { boardService } = require("~/services/boardService")
const { StatusCodes } = require("http-status-codes")

const boards = async (req, res, next) => {
  try {
    const listBoard = await boardService.boards()

    res.status(StatusCodes.OK).json({ boards: listBoard })
  } catch (error) {
    next(error)
  }
};

export const boardController = {
  boards,
};
