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

// [PUT] /columns/:id
const updateColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const updateColumn = await columnService.updateColumn(columnId, req.body)

    res.status(StatusCodes.OK).json(updateColumn)
  } catch (error) {
    next(error)
  }
};

// [DELETE] /columns/:id
const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const result = await columnService.deleteItem(columnId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
};


export const columnController = {
  addColumn,
  updateColumn,
  deleteItem
};
