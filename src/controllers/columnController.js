const { columnService } = require("~/services/columnService")
const { StatusCodes } = require("http-status-codes")


// [POST] /columns/add-column
const addColumn = async (req, res, next) => {
  try {
    const newColumn = req.body
    const column = await columnService.addColumn(newColumn)

    res.status(StatusCodes.CREATED).json(column)
  } catch (error) {
    next(error)
  }
};


export const columnController = {
  addColumn
};
