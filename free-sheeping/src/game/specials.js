// 5 bonus-card definitions. Each has 3 copies in the deck (see deck.js).
// `kind` tags which branch useGameState.js dispatches to. A bonus card is
// only usable once it has joined a player's inventory via a later successful
// stop — never the turn it was drawn.
export const SPECIALS = [
  {
    id: 'S01',
    kind: 'coupon',
    icon: '🎟️',
    name: 'Discount Coupon',
    nameHe: 'קופון הנחה',
    price: 3,
    description: 'Reduce the order total by 5.',
    descriptionHe: 'מפחית את סכום ההזמנה ב-5.',
  },
  {
    id: 'S02',
    kind: 'freeReturn',
    icon: '↩️',
    name: 'Free Return',
    nameHe: 'החזרה חינם',
    price: 4,
    description: 'Remove one product from the cart.',
    descriptionHe: 'מסיר מוצר אחד מהעגלה.',
  },
  {
    id: 'S03',
    kind: 'shippingInsurance',
    icon: '🛡️',
    name: 'Shipping Insurance',
    nameHe: 'ביטוח משלוח',
    price: 5,
    description: 'Cancel up to 2 accumulated problem points.',
    descriptionHe: 'מבטל עד 2 נקודות תקלה שנצברו.',
  },
  {
    id: 'S04',
    kind: 'extraPick',
    icon: '➕',
    name: 'Extra Pick',
    nameHe: 'בחירה נוספת',
    price: 4,
    description: 'Keep one additional product from the cart.',
    descriptionHe: 'שומר מוצר נוסף אחד מהעגלה.',
  },
  {
    id: 'S05',
    kind: 'sneakPeek',
    icon: '👀',
    name: 'Sneak Peek',
    nameHe: 'הצצה חטופה',
    price: 2,
    description: 'Look at the next 2 deck cards and return them in either order.',
    descriptionHe: 'חושפת את 2 הקלפים הבאים בחבילה ומאפשרת להחזיר אותם בכל סדר.',
  },
]

export const SPECIALS_BY_ID = Object.fromEntries(SPECIALS.map((s) => [s.id, s]))
export const COPIES_PER_SPECIAL = 3
