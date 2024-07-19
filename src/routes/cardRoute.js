const express = require("express")
const router = express.Router()
const { cardController } = require("~/controllers/cardController")
const { cardValidation } = require("~/validations/cardValidation")

router.post('/add-card', cardValidation.addCard, cardController.addCard)

module.exports = router