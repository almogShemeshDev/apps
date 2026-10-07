export const COLORS = ['yellow', 'blue', 'red', 'green', 'white']

export const COLOR_META = {
  yellow: { icon: '🟡', hex: '#f1c40f' },
  blue: { icon: '🔵', hex: '#3b82f6' },
  red: { icon: '🔴', hex: '#e74c3c' },
  green: { icon: '🟢', hex: '#27ae60' },
  white: { icon: '⚪', hex: '#f5f5f5' },
}

export const CARDS_PER_COLOR = 12
export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 4

export function handCounts(hand) {
  return COLORS.map((color) => ({ color, count: hand.filter((c) => c === color).length })).filter(
    (c) => c.count > 0
  )
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildFullDeckColors() {
  const all = []
  for (const color of COLORS) {
    for (let i = 0; i < CARDS_PER_COLOR; i++) all.push(color)
  }
  return all
}

// Builds this game's deck for a given player count: cardsPerRound = players * 2,
// and any cards that don't divide evenly into full rounds are secretly set aside
// (removed from play entirely) before the remaining cards are shuffled into the deck.
export function setupDeck(playerCount) {
  const all = shuffle(buildFullDeckColors())
  const cardsPerRound = playerCount * 2
  const excess = all.length % cardsPerRound
  const removedCount = excess
  const deck = all.slice(excess)
  const totalRounds = deck.length / cardsPerRound
  return { deck, removedCount, cardsPerRound, totalRounds }
}
