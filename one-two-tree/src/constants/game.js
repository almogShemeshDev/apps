export const SUITS = ['red', 'blue', 'green', 'yellow']

export const CARDS_PER_PLAYER = { 3: 13, 4: 14, 5: 10 }

export const VALUES = {
  TREE: 'tree',
  ONE: 1,
  TWO: 2,
}

// Numeric rank for comparison (tree handled separately in trick logic)
export const VALUE_RANK = {
  tree: 3,
  2: 2,
  1: 1,
}

export function createDeck() {
  const cards = []
  let id = 0

  const counts = {
    tree: 3,
    1: 6,
    2: 5,
  }

  for (const suit of SUITS) {
    for (const [value, count] of Object.entries(counts)) {
      for (let i = 0; i < count; i++) {
        cards.push({ id: id++, suit, value: value === '1' ? 1 : value === '2' ? 2 : 'tree' })
      }
    }
  }

  return cards
}
