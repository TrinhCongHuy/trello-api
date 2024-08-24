import express from "express"
const router = express.Router()
import { columnController } from "~/controllers/columnController"
import { authMiddleware } from "~/middlewares/authMiddleware"
import { columnValidation } from "~/validations/columnValidation"

router.post('/add-column', authMiddleware.isAuthorized, columnValidation.addColumn, columnController.addColumn)
router.put('/:id', authMiddleware.isAuthorized, columnValidation.update, columnController.updateColumn)
router.delete('/:id', authMiddleware.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)



export const columnRoute = router