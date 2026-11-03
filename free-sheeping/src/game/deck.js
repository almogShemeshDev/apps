import { PRODUCTS, PRODUCT_DUPLICATES } from './products.js'
import { SPECIALS, COPIES_PER_SPECIAL, SPECIAL_EXTRA_COPIES } from './specials.js'
import { PROBLEMS, PROBLEM_DUPLICATES } from './problems.js'

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Deck size scales with player count so the ratio of cards to players stays
// roughly constant:
//   2-3 players: 70 cards (45 products, 15 bonus cards, 10 problem cards)
//   4 players:  100 cards (65 products, 20 bonus cards, 15 problem cards)
//   5 players:  120 cards (80 products, 20 bonus cards, 20 problem cards)
// Extra copies beyond the base set are tagged with the minimum player count
// that includes them (see *_DUPLICATES / *_EXTRA_COPIES in each card file).
// Deck is an array of instances; index 0 is the top of the deck.
export function buildDeck(playerCount = 2) {
  const instances = []

  for (const p of PRODUCTS) {
    instances.push({ instanceId: p.id, defId: p.id, type: 'product' })
  }
  for (const dup of PRODUCT_DUPLICATES) {
    if (playerCount < dup.minPlayers) continue
    instances.push({
      instanceId: `${dup.defId}-dup${dup.minPlayers}`,
      defId: dup.defId,
      type: 'product',
      tier: dup.minPlayers,
    })
  }

  for (const s of SPECIALS) {
    for (let i = 1; i <= COPIES_PER_SPECIAL; i++) {
      instances.push({ instanceId: `${s.id}-${i}`, defId: s.id, type: 'special' })
    }
  }
  for (const dup of SPECIAL_EXTRA_COPIES) {
    if (playerCount < dup.minPlayers) continue
    instances.push({ instanceId: `${dup.defId}-dup${dup.minPlayers}`, defId: dup.defId, type: 'special' })
  }

  for (const p of PROBLEMS) {
    instances.push({ instanceId: p.id, defId: p.id, type: 'problem' })
  }
  for (const dup of PROBLEM_DUPLICATES) {
    if (playerCount < dup.minPlayers) continue
    instances.push({ instanceId: `${dup.defId}-dup${dup.minPlayers}`, defId: dup.defId, type: 'problem' })
  }

  return shuffle(instances)
}
