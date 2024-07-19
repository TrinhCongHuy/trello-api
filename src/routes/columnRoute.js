const express = require("express")
const router = express.Router()
const { columnController } = require("~/controllers/columnController")
const { columnValidation } = require("~/validations/columnValidation")

router.post('/add-column', columnValidation.addColumn, columnController.addColumn)

module.exports = router