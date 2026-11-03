// 10 unique problem cards (like products, exactly one copy each in the deck).
// price is always 0 — problem cards never add to the order total, but their
// points accumulate toward the 3-point bust threshold (see useGameState.js).
export const PROBLEMS = [
  { id: 'PR01', icon: '📦', name: 'Scratched Package', nameHe: 'אריזה שרוטה', price: 0, points: 1 },
  { id: 'PR02', icon: '🐌', name: 'Delayed Shipment', nameHe: 'משלוח מתעכב', price: 0, points: 1 },
  { id: 'PR03', icon: '📏', name: 'Wrong Size', nameHe: 'מידה שגויה', price: 0, points: 1 },
  { id: 'PR04', icon: '📄', name: 'Missing Manual', nameHe: 'חוברת הדרכה חסרה', price: 0, points: 1 },
  { id: 'PR05', icon: '🎨', name: 'Faded Color', nameHe: 'צבע שדהה', price: 0, points: 1 },
  { id: 'PR06', icon: '🔘', name: 'Loose Button', nameHe: 'כפתור רפוי', price: 0, points: 1 },
  { id: 'PR07', icon: '💧', name: 'Minor Stain', nameHe: 'כתם קטן', price: 0, points: 1 },
  { id: 'PR08', icon: '📬', name: 'Dented Box', nameHe: 'קופסה מעוכה', price: 0, points: 1 },
  { id: 'PR09', icon: '🚫', name: 'Counterfeit Item', nameHe: 'פריט מזויף', price: 0, points: 2 },
  { id: 'PR10', icon: '🛃', name: 'Customs Seizure', nameHe: 'החרמה במכס', price: 0, points: 2 },
]

export const PROBLEMS_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]))

// Extra copies that join the deck in bigger games, preserving the 4:1 ratio
// of 1-point to 2-point problem cards: +5 (4 at 1pt, 1 at 2pt) once there
// are 4+ players (10 -> 15), plus +5 more at 5 players (15 -> 20).
export const PROBLEM_DUPLICATES = [
  { defId: 'PR01', minPlayers: 4 },
  { defId: 'PR02', minPlayers: 4 },
  { defId: 'PR03', minPlayers: 4 },
  { defId: 'PR04', minPlayers: 4 },
  { defId: 'PR09', minPlayers: 4 },
  { defId: 'PR05', minPlayers: 5 },
  { defId: 'PR06', minPlayers: 5 },
  { defId: 'PR07', minPlayers: 5 },
  { defId: 'PR08', minPlayers: 5 },
  { defId: 'PR10', minPlayers: 5 },
]
