import { loadCards } from './data/store.js'
import { newCardDeck } from './ordering/cardproducer.js'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes.js'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes.js'
import { newCardShuffler } from './ordering/prioritization/cardshuffler.js'
import { newUI } from './ui.js'

const HELP_TEXT = `Usage: flashcard <cards-file> [options]

Options:
  --help                    Show this help message
  --order <order>           Card order: random, worst-first, recent-mistakes-first (default: random)
  --repetitions <num>       Number of correct answers required per card (default: 1)
  --invertCards             Swap question and answer on all cards
`

const args = process.argv.slice(2)

if (args.includes('--help') || args.length === 0) {
  console.log(HELP_TEXT)
  process.exit(0)
}

const cardsFile = args[0]

// --order
let order = 'random'
const orderIdx = args.indexOf('--order')
if (orderIdx !== -1) {
  const orderVal = args[orderIdx + 1]
  if (!['random', 'worst-first', 'recent-mistakes-first'].includes(orderVal)) {
    console.error(`Invalid order: "${orderVal}". Choose from: random, worst-first, recent-mistakes-first`)
    process.exit(1)
  }
  order = orderVal
}

// --repetitions
let repetitions = 1
const repIdx = args.indexOf('--repetitions')
if (repIdx !== -1) {
  repetitions = parseInt(args[repIdx + 1])
  if (isNaN(repetitions) || repetitions < 1) {
    console.error('Invalid repetitions value. Must be a positive integer.')
    process.exit(1)
  }
}

// --invertCards
const invertCards = args.includes('--invertCards')

// Картуудыг ачаалах
let cardStore = loadCards(cardsFile)
if (invertCards) {
  cardStore = cardStore.invertCards()
}

// Organizer сонгох
const organizer = order === 'worst-first'
  ? newMostMistakesFirstSorter()
  : order === 'recent-mistakes-first'
    ? newRecentMistakesFirstSorter()
    : newCardShuffler()

const cardDeck = newCardDeck(cardStore.getAllCards(), organizer, repetitions)
newUI().studyCards(cardDeck)
