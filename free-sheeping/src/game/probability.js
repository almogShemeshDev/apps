import { PRODUCTS_BY_ID } from './products.js'
import { SPECIALS_BY_ID } from './specials.js'
import { PROBLEMS_BY_ID } from './problems.js'

export function instancePrice(instance) {
  if (instance.type === 'product') return PRODUCTS_BY_ID[instance.defId].price
  if (instance.type === 'problem') return PROBLEMS_BY_ID[instance.defId].price
  return SPECIALS_BY_ID[instance.defId].price
}

export function instancePoints(instance) {
  if (instance.type !== 'problem') return 0
  return PROBLEMS_BY_ID[instance.defId].points
}

// All probabilities read the actual remaining deck (sampling without replacement),
// never a fixed/independent distribution. "Next draw" calculations assume no
// additional bonus abilities are activated, per spec.
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

export function probNextIsProblem(deck) {
  if (!deck.length) return 0
  return deck.filter((c) => c.type === 'problem').length / deck.length
}

// Probability that the next draw pushes accumulated problem points (net of
// any Shipping Insurance already used this turn) to the 3-point bust line.
export function probBust(deck, effectiveProblemPoints) {
  if (!deck.length) return 0
  const n = deck.filter((c) => c.type === 'problem' && effectiveProblemPoints + instancePoints(c) >= 3).length
  return n / deck.length
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

// Taxes: once the cart's running total exceeds the free-shipping max, every
// positive-price card from that point on (inclusive) costs -1 VP, even if
// it was drawn afterward. A Discount Coupon's flat -5 discount shifts the
// threshold up by 5 per use, since taxes are recalculated at the end of the
// turn, after bonuses apply. Zero-price problem cards are never taxed.
export function taxCardCount(orderCards, couponCount, maxLimit) {
  const threshold = maxLimit + couponCount * 5
  let cumulative = 0
  let count = 0
  for (const card of orderCards) {
    const price = instancePrice(card)
    cumulative += price
    if (price > 0 && cumulative > threshold) count++
  }
  return count
}
