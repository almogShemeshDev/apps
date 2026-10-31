import { PRODUCTS_BY_ID } from './products.js'
import { SPECIALS_BY_ID } from './specials.js'

export function instancePrice(instance) {
  const def = instance.type === 'product' ? PRODUCTS_BY_ID[instance.defId] : SPECIALS_BY_ID[instance.defId]
  return def.price
}

export function instanceVp(instance) {
  if (instance.type !== 'product') return 0
  return PRODUCTS_BY_ID[instance.defId].vp
}

// All probabilities read the actual remaining deck (sampling without replacement),
// never a fixed/independent distribution. "Next draw" calculations assume no
// additional special abilities are activated, per spec.
export function remainingByPrice(deck) {
  const counts = {}
  for (const card of deck) {
    const price = instancePrice(card)
    counts[price] = (counts[price] ?? 0) + 1
  }
  return counts
}

export function probNextIsProduct(deck) {
  if (!deck.length) return 0
  return deck.filter((c) => c.type === 'product').length / deck.length
}

export function probNextIsSpecial(deck) {
  if (!deck.length) return 0
  return deck.filter((c) => c.type === 'special').length / deck.length
}

export function probOverflow(deck, effectiveTotal, maxLimit) {
  if (!deck.length) return 0
  const n = deck.filter((c) => effectiveTotal + instancePrice(c) > maxLimit).length
  return n / deck.length
}

export function probWithinWindow(deck, effectiveTotal, minLimit, maxLimit) {
  if (!deck.length) return 0
  const n = deck.filter((c) => {
    const t = effectiveTotal + instancePrice(c)
    return t >= minLimit && t <= maxLimit
  }).length
  return n / deck.length
}

export function probBelowMin(deck, effectiveTotal, minLimit) {
  if (!deck.length) return 0
  const n = deck.filter((c) => effectiveTotal + instancePrice(c) < minLimit).length
  return n / deck.length
}

export function expectedNextVp(deck) {
  if (!deck.length) return 0
  const total = deck.reduce((sum, c) => sum + instanceVp(c), 0)
  return total / deck.length
}
