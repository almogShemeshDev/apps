// How many product cards may be kept on a successful stop, based on how
// many product cards are in the cart. Shared by game logic (useGameState.js)
// and the UI (ShoppingCart.vue) so the displayed legend never drifts from
// the actual rule.
export const KEEP_TIERS = [
  { min: 1, max: 3, keep: 1 },
  { min: 4, max: 5, keep: 2 },
  { min: 6, max: 7, keep: 3 },
  { min: 8, max: Infinity, keep: 4 },
]

export function baseKeepTier(productCount) {
  if (productCount <= 0) return 0
  const tier = KEEP_TIERS.find((t) => productCount >= t.min && productCount <= t.max)
  return tier ? tier.keep : KEEP_TIERS[KEEP_TIERS.length - 1].keep
}

// How many more product cards are needed to reach the next keep tier, and
// what that tier would let you keep. Null once the top tier is reached.
export function nextKeepTierGap(productCount) {
  for (const tier of KEEP_TIERS) {
    if (productCount < tier.min) {
      return { remaining: tier.min - productCount, nextKeep: tier.keep }
    }
  }
  return null
}
