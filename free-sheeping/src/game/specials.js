// 5 special-card definitions. Each has 3 copies in the deck (see deck.js).
// `kind` tags which branch useGameState.doUseSpecial dispatches to.
export const SPECIALS = [
  {
    id: 'S01',
    kind: 'coupon',
    icon: '🎟️',
    name: 'Discount Coupon',
    nameHe: 'קופון הנחה',
    price: 0,
    description: 'Reduce the current order total by 3.',
    descriptionHe: 'מפחית את סכום ההזמנה הנוכחית ב-3.',
  },
  {
    id: 'S02',
    kind: 'freeReturn',
    icon: '↩️',
    name: 'Free Return',
    nameHe: 'החזרה חינם',
    price: 0,
    description: 'Remove the most recently drawn product from the current order.',
    descriptionHe: 'מסיר את המוצר האחרון שנשלף מההזמנה הנוכחית.',
  },
  {
    id: 'S03',
    kind: 'taxInsurance',
    icon: '🛡️',
    name: 'Tax Insurance',
    nameHe: 'ביטוח מכס',
    price: 2,
    description: 'Increase the maximum shipping limit by 5 for the current turn.',
    descriptionHe: 'מעלה את תקרת המשלוח ב-5 עבור התור הנוכחי.',
  },
  {
    id: 'S04',
    kind: 'flashSale',
    icon: '⚡',
    name: 'Flash Sale',
    nameHe: 'מכירת פלאש',
    price: 2,
    description: 'Reduce the price of up to two products in the current order by 2 each.',
    descriptionHe: 'מפחית את מחירם של עד שני מוצרים בהזמנה הנוכחית ב-2 כל אחד.',
  },
  {
    id: 'S05',
    kind: 'sneakPeek',
    icon: '👀',
    name: 'Sneak Peek',
    nameHe: 'הצצה חטופה',
    price: 0,
    description: 'Reveal the next deck card and choose whether to draw it.',
    descriptionHe: 'חושף את הקלף הבא בחבילה ומאפשר לבחור אם לשלוף אותו.',
  },
]

export const SPECIALS_BY_ID = Object.fromEntries(SPECIALS.map((s) => [s.id, s]))
export const COPIES_PER_SPECIAL = 3
