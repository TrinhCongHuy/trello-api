const express = require("express")
const router = express.Router()
const { boardController } = require("~/controllers/boardController")
const { boardValidation } = require("~/validations/boardValidation")

router.get('/', boardController.boards)
router.post('/add-board', boardValidation.addBoard, boardController.addBoard)
router.get('/:id', boardController.detailBoard)
router.put('/:id', boardValidation.update, boardController.updateBoard)
router.put('/supports/moving_card', boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)


module.exports = router