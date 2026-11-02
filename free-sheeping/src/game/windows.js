// The shipping window is fixed for the whole game — it no longer moves.
export const SHIPPING_WINDOW = { min: 15, max: 25 }

// Shipping fee/penalty for a successful order total, in VP to subtract at
// game end. Below the window: a flat fee. Above it: 1 VP per 5 units over,
// rounded up. Within it: free.
export function shippingPenaltyFor(total) {
  if (total < SHIPPING_WINDOW.min) return 2
  if (total > SHIPPING_WINDOW.max) return Math.ceil((total - SHIPPING_WINDOW.max) / 5)
  return 0
}
