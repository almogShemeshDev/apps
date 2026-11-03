// The free-shipping window is fixed for the whole game.
export const SHIPPING_WINDOW = { min: 8, max: 13 }

// Flat shipping fee for an order that finishes below the free-shipping
// minimum, in VP to subtract at game end. Orders within the window pay
// nothing; orders above it pay no flat fee here — exceeding the window is
// penalized per-card instead (see taxCardCount in probability.js).
export function belowMinPenaltyFor(total) {
  return total < SHIPPING_WINDOW.min ? 2 : 0
}
