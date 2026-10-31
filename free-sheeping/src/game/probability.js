import { PRODUCTS_BY_ID } from './products.js'
import { SPECIALS_BY_ID } from './specials.js'
import { scoreForCategoryCount } from './scoring.js'

export function instancePrice(instance) {
  const def = instance.type === 'product' ? PRODUCTS_BY_ID[instance.defId] : SPECIALS_BY_ID[instance.defId]
  return def.price
}

export function instanceCategory(instance) {
  if (instance.type !== 'product') return null
  return PRODUCTS_BY_ID[instance.defId].category
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

// collectedCategories: a Set of category ids already represented in the cart.
export function probNewCategory(deck, collectedCategories) {
  if (!deck.length) return 0
  const n = deck.filter((c) => c.type === 'product' && !collectedCategories.has(instanceCategory(c))).length
  return n / deck.length
}

export function probDuplicateCategory(deck, collectedCategories) {
  if (!deck.length) return 0
  const n = deck.filter((c) => c.type === 'product' && collectedCategories.has(instanceCategory(c))).length
  return n / deck.length
}

// A new category always raises the shipment score (the table is strictly
// increasing from 0-5 categories), so this is the same event as
// probNewCategory, kept as its own named function to match the spec.
export function probNextIncreasesVp(deck, collectedCategories) {
  return probNewCategory(deck, collectedCategories)
}

// Expected VP gain from a single next draw, ignoring further draws or
// special-card activation: specials and duplicate categories contribute 0;
// a new category contributes the score delta for going from the current
// count to count+1.
export function expectedNextVpGain(deck, collectedCategories) {
  if (!deck.length) return 0
  const count = collectedCategories.size
  const delta = scoreForCategoryCount(count + 1) - scoreForCategoryCount(count)
  const newCategoryCards = deck.filter(
    (c) => c.type === 'product' && !collectedCategories.has(instanceCategory(c))
  ).length
  return (newCategoryCards * delta) / deck.length
}
