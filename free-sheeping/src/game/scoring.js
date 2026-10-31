import { PRODUCTS_BY_ID } from './products.js'

// Shipment VP is driven entirely by how many distinct product categories
// are represented, not by summing individual product values.
const SCORE_BY_CATEGORY_COUNT = [0, 1, 3, 6, 10, 15]

export function scoreForCategoryCount(count) {
  const i = Math.max(0, Math.min(count, SCORE_BY_CATEGORY_COUNT.length - 1))
  return SCORE_BY_CATEGORY_COUNT[i]
}

// cards: array of card instances ({ type, defId, ... }). Specials never
// contribute a category.
export function categoriesInCards(cards) {
  const set = new Set()
  for (const c of cards) {
    if (c.type === 'product') set.add(PRODUCTS_BY_ID[c.defId].category)
  }
  return set
}

export function potentialVp(cards) {
  return scoreForCategoryCount(categoriesInCards(cards).size)
}
