import { CardStatus } from '../../cards/cardstatus.js'
import { CardOrganizer } from '../cardorganizer.js'

function newRecentMistakesFirstSorter (): CardOrganizer {
  return {
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      const c = cards.slice()
      c.sort((a, b) => {
        const resultsA = a.getResults()
        const resultsB = b.getResults()

        const lastA = resultsA[resultsA.length - 1]
        const lastB = resultsB[resultsB.length - 1]

        // Boolean-г шууд шалгах (ts-standard-д нийцүүлсэн)
        if (!lastA && lastB) return -1
        if (lastA && !lastB) return 1
        return 0
      })
      return c
    }
  }
}

export { newRecentMistakesFirstSorter }
