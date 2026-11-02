// Five product categories. Shipment VP is scored by how many distinct
// categories are represented in a shipment, not by individual product VP.
export const CATEGORIES = [
  { id: 'fashion', name: 'Fashion & Beauty', nameHe: 'אופנה ויופי', icon: '👗' },
  { id: 'home', name: 'Home & Living', nameHe: 'בית ומגורים', icon: '🏠' },
  { id: 'tech', name: 'Technology & Gadgets', nameHe: 'טכנולוגיה וגאדג׳טים', icon: '🔌' },
  { id: 'food', name: 'Food & Kitchen', nameHe: 'אוכל ומטבח', icon: '🍽️' },
  { id: 'leisure', name: 'Leisure & Miscellaneous', nameHe: 'פנאי ושונות', icon: '🎉' },
]

export const CATEGORIES_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))
export const CATEGORY_ORDER = CATEGORIES.map((c) => c.id)
