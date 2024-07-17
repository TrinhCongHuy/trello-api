const express = require("express")
const router = express.Router()
const { boardController } = require("~/controllers/boardController")

router.get('/', boardController.boards)

module.exports = router