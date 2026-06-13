import { VALUE_RANK } from '../constants/game.js'

export function resolveTrick(plays) {
  if (!plays.length) return null

  const leadSuit = plays[0].card.suit
  const treePlays = plays.filter(p => p.card.value === 'tree')

  if (treePlays.length === 1) {
    return treePlays[0].playerId
  }

  const candidates = plays.filter(p => p.card.value !== 'tree' && p.card.suit === leadSuit)
  if (!candidates.length) return plays[0].playerId

  return candidates.reduce((best, p) =>
    VALUE_RANK[p.card.value] > VALUE_RANK[best.card.value] ? p : best
  ).playerId
}

export function legalCards(hand, leadSuit, bidCard = null) {
  const pool = bidCard ? [...hand, bidCard] : hand
  if (!leadSuit) return pool
  const suitCards = pool.filter(c => c.suit === leadSuit)
  return suitCards.length ? suitCards : pool
}

export function isBidCorrect(bidCard, tricksWon) {
  if (!bidCard) return false
  if (bidCard.value === 'tree') return tricksWon === 0 || tricksWon === 3
  return tricksWon === bidCard.value
}
