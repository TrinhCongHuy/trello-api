const { cardService } = require("~/services/cardService")
const { StatusCodes } = require("http-status-codes")


// [POST] /cards/add-card
const addCard = async (req, res, next) => {
  try {
    const newCard = req.body
    const card = await cardService.addCard(newCard)

    res.status(StatusCodes.CREATED).json(card)
  } catch (error) {
    next(error)
  }
};


export const cardController = {
  addCard
};
