import { FlashCard } from './cards/flashcard.js'
import { CardDeck } from './ordering/cardproducer.js'
import { CardStatus } from './cards/cardstatus.js'
import readline from 'readline-sync'

interface UI {
  studyCards: (producer: CardDeck) => void
}

function newUI (): UI {
  function checkAchievements (allCards: CardStatus[]): void {
    // CORRECT: Сүүлийн тойрогт бүх карт зөв хариулагдсан
    const allCorrect = allCards.every(card => {
      const results = card.getResults()
      return results.length > 0 && results[results.length - 1]
    })
    if (allCorrect) console.log('🏆 Achievement: CORRECT - Бүх картыг зөв хариуллаа!')

    // REPEAT: Нэг картад 5-аас олон удаа хариулсан
    const hasRepeat = allCards.some(card => card.getResults().length > 5)
    if (hasRepeat) console.log('🔁 Achievement: REPEAT - Нэг картад 5+ удаа хариуллаа!')

    // CONFIDENT: Нэг картад дор хаяж 3 удаа зөв хариулсан
    const hasConfident = allCards.some(card => {
      const correctCount = card.getResults().filter(r => r).length
      return correctCount >= 3
    })
    if (hasConfident) console.log('💪 Achievement: CONFIDENT - Нэг картад 3+ удаа зөв хариуллаа!')
  }

  function cueCard (card: FlashCard): boolean {
    console.log('\nNext cue: ' + card.getQuestion())
    const line = readline.question('answer> ')
    const success = card.checkSuccess(line)
    if (success) {
      console.log("That's correct!")
    } else {
      console.log('That is incorrect; the correct response was: ' + card.getAnswer())
    }
    return success
  }

  function cueAllCards (producer: CardDeck): void {
    for (const cardStatus of producer.getCards()) {
      const card = cardStatus.getCard()
      const correctAnswer = cueCard(card)
      cardStatus.recordResult(correctAnswer)
    }
  }

  return {
    studyCards (producer: CardDeck): void {
      const allCards = producer.getCards()
      while (!producer.isComplete()) {
        console.log(`${producer.countCards()} cards to go...`)
        cueAllCards(producer)
        checkAchievements(allCards)
        console.log('Reached the end of the card deck, reorganizing...')
        producer.reorganize()
      }
      console.log('Finished all cards. Yay.')
    }
  }
}

export { newUI }
