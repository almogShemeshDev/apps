export const DISC_TYPES = {
  visitor: { id: 'visitor', icon: '🔵', color: '#3b82f6' },
  worker: { id: 'worker', icon: '🔴', color: '#e74c3c' },
  gardener: { id: 'gardener', icon: '🟢', color: '#27ae60' },
  money: { id: 'money', icon: '🟡', color: '#f1c40f' },
  grey: { id: 'grey', icon: '⚫', color: '#6b7280' },
}

export const STARTING_BAG = [
  ...Array(6).fill('money'),
  ...Array(4).fill('visitor'),
]

export const DISCS_PER_DRAW = 5

export const VICTORY_VP = 25
export const SOLO_TURN_LIMIT = 20

// use: { discs: [{ type, amount }], gold?: number }
// benefits: array of effects, each one of:
//   { type: 'vp', amount }
//   { type: 'gold', amount }
//   { type: 'drawDiscs', amount }                        -- pull N discs from bag into hand
//   { type: 'discardDiscs', amount }                      -- player chooses N discs from hand -> discard pile
//   { type: 'trashDiscs', amount, filter? }                -- player chooses N discs from hand -> removed from game;
//                                                              if `filter` is a disc type, only discs of that type
//                                                              are eligible, and the effect is skipped entirely if
//                                                              the player has none of that type in hand
//   { type: 'gainDisc', disc, amount }                     -- add N discs of `disc` type to the discard pile
// A card with multiple alternative abilities (e.g. Spinning Cups) defines
// `options: [{ id, use, benefits, maxUsesPerTurn }, ...]` instead of use/benefits/maxUsesPerTurn.
export const CARD_DEFS = {
  carousel: {
    id: 'carousel',
    icon: '🎠',
    use: { discs: [{ type: 'visitor', amount: 3 }] },
    benefits: [{ type: 'vp', amount: 1 }],
  },
  cashier: {
    id: 'cashier',
    icon: '💵',
    use: { discs: [{ type: 'money', amount: 1 }] },
    benefits: [{ type: 'gold', amount: 1 }],
    maxUsesPerTurn: 2,
  },
  familyDay: {
    id: 'familyDay',
    icon: '👨‍👩‍👧',
    cost: 3,
    use: { discs: [{ type: 'visitor', amount: 3 }] },
    benefits: [{ type: 'gainDisc', disc: 'visitor', amount: 1 }],
  },
  popcorn: {
    id: 'popcorn',
    icon: '🍿',
    cost: 1,
    use: { discs: [{ type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'gold', amount: 1 }],
    maxUsesPerTurn: 3,
  },
  poster: {
    id: 'poster',
    icon: '🪧',
    cost: 2,
    use: { discs: [{ type: 'money', amount: 1 }] },
    benefits: [{ type: 'drawDiscs', amount: 1 }],
  },
  hotdogs: {
    id: 'hotdogs',
    icon: '🌭',
    cost: 2,
    use: { discs: [{ type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'gold', amount: 1 }],
    maxUsesPerTurn: 5,
  },
  ferrisWheel: {
    id: 'ferrisWheel',
    icon: '🎡',
    cost: 2,
    use: { discs: [{ type: 'visitor', amount: 2 }] },
    benefits: [{ type: 'vp', amount: 2 }],
  },
  flowersGarden: {
    id: 'flowersGarden',
    icon: '🌷',
    cost: 2,
    use: { discs: [{ type: 'gardener', amount: 2 }] },
    benefits: [{ type: 'vp', amount: 1 }],
  },
  bushesSculptures: {
    id: 'bushesSculptures',
    icon: '🌳',
    cost: 3,
    use: { discs: [{ type: 'gardener', amount: 1 }] },
    benefits: [{ type: 'vp', amount: 1 }],
  },
  electricCars: {
    id: 'electricCars',
    icon: '🚗',
    cost: 4,
    use: { discs: [{ type: 'visitor', amount: 1 }, { type: 'worker', amount: 1 }] },
    benefits: [{ type: 'vp', amount: 3 }],
  },
  bullsEye: {
    id: 'bullsEye',
    icon: '🎯',
    cost: 3,
    use: { discs: [{ type: 'money', amount: 1 }, { type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'drawDiscs', amount: 2 }, { type: 'discardDiscs', amount: 1 }],
  },
  recruit: {
    id: 'recruit',
    icon: '📋',
    cost: 3,
    use: { discs: [{ type: 'money', amount: 3 }] },
    benefits: [{ type: 'gainDisc', disc: 'worker', amount: 1 }],
  },
  rollercoaster: {
    id: 'rollercoaster',
    icon: '🎢',
    cost: 4,
    use: { discs: [{ type: 'visitor', amount: 2 }, { type: 'worker', amount: 1 }] },
    benefits: [{ type: 'vp', amount: 3 }, { type: 'gainDisc', disc: 'grey', amount: 1 }],
  },
  juggling: {
    id: 'juggling',
    icon: '🤹',
    cost: 2,
    use: { discs: [{ type: 'money', amount: 1 }, { type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'drawDiscs', amount: 1 }, { type: 'discardDiscs', amount: 1 }],
  },
  pirateBoat: {
    id: 'pirateBoat',
    icon: '🏴‍☠️',
    cost: 3,
    use: { discs: [{ type: 'visitor', amount: 3 }] },
    benefits: [{ type: 'discardDiscs', amount: 1 }, { type: 'vp', amount: 1 }],
  },
  ghostsRiders: {
    id: 'ghostsRiders',
    icon: '👻',
    cost: 2,
    use: { discs: [{ type: 'visitor', amount: 2 }] },
    benefits: [
      { type: 'vp', amount: 2 },
      { type: 'gold', amount: 1 },
      { type: 'trashDiscs', amount: 1 },
      { type: 'gainDisc', disc: 'grey', amount: 1 },
    ],
  },
  spinningCups: {
    id: 'spinningCups',
    icon: '🍵',
    cost: 3,
    options: [
      {
        id: 'a',
        use: { discs: [{ type: 'visitor', amount: 1 }] },
        benefits: [{ type: 'vp', amount: 1 }],
      },
      {
        id: 'b',
        use: { discs: [{ type: 'visitor', amount: 2 }] },
        benefits: [{ type: 'vp', amount: 1 }],
      },
    ],
  },
  cleaningStaff: {
    id: 'cleaningStaff',
    icon: '🧹',
    cost: 1,
    use: { discs: [{ type: 'money', amount: 1 }, { type: 'gardener', amount: 2 }] },
    benefits: [{ type: 'vp', amount: 1 }],
  },
  freeFall: {
    id: 'freeFall',
    icon: '🪂',
    cost: 4,
    use: { discs: [{ type: 'visitor', amount: 1 }, { type: 'worker', amount: 2 }] },
    benefits: [{ type: 'vp', amount: 2 }, { type: 'discardDiscs', amount: 1 }],
  },
  gardener: {
    id: 'gardener',
    icon: '🧑‍🌾',
    cost: 2,
    use: { discs: [{ type: 'money', amount: 2 }] },
    benefits: [{ type: 'gainDisc', disc: 'gardener', amount: 1 }],
  },
  birthdayParty: {
    id: 'birthdayParty',
    icon: '🎂',
    cost: 4,
    use: { discs: [{ type: 'money', amount: 1 }] },
    benefits: [{ type: 'gold', amount: 2 }],
  },
  iceCream: {
    id: 'iceCream',
    icon: '🍦',
    cost: 5,
    use: { discs: [{ type: 'visitor', amount: 2 }, { type: 'worker', amount: 1 }] },
    benefits: [{ type: 'vp', amount: 1 }, { type: 'trashDiscs', amount: 1, filter: 'grey' }],
  },
  souvenirs: {
    id: 'souvenirs',
    icon: '🛍️',
    cost: 5,
    use: { discs: [{ type: 'money', amount: 1 }, { type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'trashDiscs', amount: 1, filter: 'grey' }],
  },
  flyingChairs: {
    id: 'flyingChairs',
    icon: '🪑',
    cost: 2,
    use: { discs: [{ type: 'worker', amount: 1 }, { type: 'visitor', amount: 2 }] },
    benefits: [{ type: 'discardDiscs', amount: 2 }, { type: 'vp', amount: 1 }],
  },
}

export function getCardOptions(def) {
  if (def.options) return def.options
  return [{ id: 'default', use: def.use, benefits: def.benefits, maxUsesPerTurn: def.maxUsesPerTurn ?? 1 }]
}

export const STARTING_TABLEAU = ['carousel', 'cashier']

// Carousel and Cashier are starter cards every player already begins with one
// copy of; they're not purchasable from the market.
const NOT_IN_MARKET = new Set(['carousel', 'cashier'])
export const MARKET_CARD_SUPPLY = 3

export const MARKET_INITIAL_SUPPLY = Object.fromEntries(
  Object.keys(CARD_DEFS)
    .filter((id) => !NOT_IN_MARKET.has(id))
    .map((id) => [id, MARKET_CARD_SUPPLY])
)

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
