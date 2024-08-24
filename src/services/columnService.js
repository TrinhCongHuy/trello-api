import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"
import { cardModel } from "~/models/cardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

// [POST] /columns/add-column
const addColumn = async (data) => {
  try {
    const newColumn = {
      ...data
    }

    const createColumn = await columnModel.addColumn(newColumn)
    const column = await columnModel.findOneById(
      createColumn.insertedId.toString()
    )

    if (column) {
        column.cards = []

        await boardModel.pushColumnOrderIds(column)
    }

    return column
  } catch (error) {
    throw error
  }
}

// [PUT] /columns/:id
const updateColumn = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const column = await columnModel.update(columnId, updateData)
    return column
  } catch (error) {
    throw error
  }
}

// [DELETE] /columns/:id
const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found.")
    }
    
    // Xoá column có id là columnId
    await columnModel.deleteOneById(columnId)

    // Xoá tất cả các card có columnId là columnId
    await cardModel.deleteOneById(columnId)

    // Xoá id của cái column trong mảng orderColumnIds của board
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Delete column success!' }
  } catch (error) {
    throw error
  }
}


export const columnService = {
  addColumn,
  updateColumn,
  deleteItem
}
