import { createDeck } from '../constants/game.js'

export function shuffle(deck) {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function deal(numPlayers, cardsPerPlayer) {
  const deck = shuffle(createDeck()).slice(0, numPlayers * cardsPerPlayer)
  const hands = Array.from({ length: numPlayers }, () => [])
  deck.forEach((card, i) => hands[i % numPlayers].push(card))
  return hands
}
