import express from "express"
const router = express.Router()
import { boardController } from "~/controllers/boardController"
import { authMiddleware } from "~/middlewares/authMiddleware"
import { boardValidation } from "~/validations/boardValidation"

router.get('/:id', authMiddleware.isAuthorized, boardController.boards)
router.post('/add-board', authMiddleware.isAuthorized, boardValidation.addBoard, boardController.addBoard)
router.get('/detail/:id', authMiddleware.isAuthorized, boardController.detailBoard)
router.put('/update-board/:id', authMiddleware.isAuthorized, boardValidation.update, boardController.updateBoard)
router.put('/:id', authMiddleware.isAuthorized, boardController.addUserToBoard)
router.put('/supports/moving_card', authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)


export const boardRoute = router