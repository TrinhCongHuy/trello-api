import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"

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


export const columnService = {
  addColumn,
  updateColumn
}
