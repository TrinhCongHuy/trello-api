const { boardModel } = require('~/models/boardModel')


const boards = async () => {
    try {
        const boards = await boardModel.boards()
        console.log('boards', boards)
        return boards
    } catch (error) {
        throw error
    }
}

export const boardService = {
    boards
}