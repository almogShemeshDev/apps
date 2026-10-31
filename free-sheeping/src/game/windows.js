// The 5 shared, circular shipping windows. The game starts at level 3 (15-25).
export const SHIPPING_WINDOWS = [
  { level: 1, min: 5, max: 15 },
  { level: 2, min: 10, max: 20 },
  { level: 3, min: 15, max: 25 },
  { level: 4, min: 20, max: 30 },
  { level: 5, min: 25, max: 35 },
]

export const START_LEVEL = 3

export function windowForLevel(level) {
  return SHIPPING_WINDOWS[level - 1]
}

// Circular: 5 -> 1 moving up, 1 -> 5 moving down.
export function advanceLevel(level) {
  return level === 5 ? 1 : level + 1
}

export function retreatLevel(level) {
  return level === 1 ? 5 : level - 1
}
