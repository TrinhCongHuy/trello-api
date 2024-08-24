import express from "express"
const router = express.Router()
import { cardController } from "~/controllers/cardController"
import { authMiddleware } from "~/middlewares/authMiddleware"
import { cardValidation } from "~/validations/cardValidation"

router.post('/add-card', authMiddleware.isAuthorized, cardValidation.addCard, cardController.addCard)

export const cardRoute = router