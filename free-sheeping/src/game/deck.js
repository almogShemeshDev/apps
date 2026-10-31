import { PRODUCTS } from './products.js'
import { SPECIALS, COPIES_PER_SPECIAL } from './specials.js'

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 45 products (1 copy each) + 15 specials (3 copies each) = 60 cards.
// Deck is an array of instances; index 0 is the top of the deck.
export function buildDeck() {
  const instances = []
  for (const p of PRODUCTS) {
    instances.push({ instanceId: p.id, defId: p.id, type: 'product' })
  }
  for (const s of SPECIALS) {
    for (let i = 1; i <= COPIES_PER_SPECIAL; i++) {
      instances.push({ instanceId: `${s.id}-${i}`, defId: s.id, type: 'special' })
    }
  }
  return shuffle(instances)
}
