import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"

// [POST] /cards/add-card
const addCard = async (data) => {
  try {
    const newCard = {
      ...data
    }

    const createCard = await cardModel.addCard(newCard)
    const card = await cardModel.findOneById(
      createCard.insertedId.toString()
    )

    if (card) {
        await columnModel.pushCardOrderIds(card)
    }

    return card
  } catch (error) {
    throw error
  }
}

export const cardService = {
  addCard
}
