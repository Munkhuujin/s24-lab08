import { FlashCard } from '../cards/flashcard.js'
import { CardOrganizer } from './cardorganizer.js'
import { CardStatus, newCardStatus } from '../cards/cardstatus.js'

interface CardDeck {
  getCards: () => CardStatus[]
  isComplete: () => boolean
  getOrganizer: () => CardOrganizer
  reorganize: () => void
  countCards: () => number
}

function newCardDeck (cards: FlashCard[], cardOrganizer: CardOrganizer, repetitions: number = 1): CardDeck {
  let status: CardStatus[] = cards.map(newCardStatus)

  return {
    getCards: function (): CardStatus[] {
      return status.slice()
    },
    getOrganizer: function (): CardOrganizer {
      return cardOrganizer
    },
    reorganize: function () {
      // Хангалттай удаа зөв хариулсан картыг шүүж хасна
      status = status.filter(card => {
        const results = card.getResults()
        const correctCount = results.filter(r => r).length
        return correctCount < repetitions
      })
      status = cardOrganizer.reorganize(status)
      return status
    },
    isComplete: function (): boolean {
      return status.length === 0
    },
    countCards: function () {
      return status.length
    }
  }
}

export { newCardDeck, CardDeck }
