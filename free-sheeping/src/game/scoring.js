import { PRODUCTS_BY_ID } from './products.js'
import { CATEGORY_ORDER } from './categories.js'

// Endgame collection scoring: shipments earn no immediate VP. Each of the
// five categories is scored separately from a player's lifetime collection
// of shipped products, then a diversity bonus is added if every category is
// represented at least once.
const SCORE_BY_PRODUCT_COUNT = [0, 0, 2, 5, 9] // index 0-4, 5+ -> 14
const DIVERSITY_BONUS = 5

export function scoreForCategoryProductCount(count) {
  if (count >= SCORE_BY_PRODUCT_COUNT.length) return 14
  return SCORE_BY_PRODUCT_COUNT[Math.max(0, count)]
}

// productDefIds: a player's state.productsWon array (product def ids only —
// specials are never pushed there). Returns { [categoryId]: count }, always
// containing all five category ids even when a count is 0.
export function categoryCounts(productDefIds) {
  const counts = Object.fromEntries(CATEGORY_ORDER.map((id) => [id, 0]))
  for (const defId of productDefIds) {
    const category = PRODUCTS_BY_ID[defId]?.category
    if (category) counts[category]++
  }
  return counts
}

export function hasDiversityBonus(counts) {
  return CATEGORY_ORDER.every((id) => counts[id] > 0)
}

// Full endgame score for one player's collection: the five per-category
// scores plus the diversity bonus, if earned.
export function endgameScore(productDefIds) {
  const counts = categoryCounts(productDefIds)
  const base = CATEGORY_ORDER.reduce((sum, id) => sum + scoreForCategoryProductCount(counts[id]), 0)
  return base + (hasDiversityBonus(counts) ? DIVERSITY_BONUS : 0)
}

export { DIVERSITY_BONUS }
