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
