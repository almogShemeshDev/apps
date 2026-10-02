export const DISC_TYPES = {
  visitor: { id: 'visitor', icon: '🔵', color: '#3b82f6' },
  worker: { id: 'worker', icon: '🔴', color: '#e74c3c' },
  gardener: { id: 'gardener', icon: '🟢', color: '#27ae60' },
  money: { id: 'money', icon: '🟡', color: '#f1c40f' },
}

export const STARTING_BAG = [
  ...Array(6).fill('money'),
  ...Array(4).fill('visitor'),
]

export const DISCS_PER_DRAW = 5

// use: { discs: [{ type, amount }], gold?: number }
// benefits: array of effects, each one of:
//   { type: 'vp', amount }
//   { type: 'gold', amount }
//   { type: 'negativeVp', amount }           -- tracked separately from vp
//   { type: 'drawDiscs', amount }            -- pull N discs from bag into hand
//   { type: 'discardDiscs', amount }         -- player chooses N discs from hand -> discard pile
//   { type: 'trashDiscs', amount }           -- player chooses N discs from hand -> removed from game
//   { type: 'gainDisc', disc, amount }       -- add N discs of `disc` type to discard pile
// A card with multiple alternative abilities (e.g. Spinning Cups) defines
// `options: [{ id, use, benefits, maxUsesPerTurn }, ...]` instead of use/benefits/maxUsesPerTurn.
export const CARD_DEFS = {
  carousel: {
    id: 'carousel',
    icon: '🎠',
    cost: 2,
    use: { discs: [{ type: 'visitor', amount: 1 }] },
    benefits: [{ type: 'vp', amount: 1 }],
  },
  cashier: {
    id: 'cashier',
    icon: '💵',
    cost: 2,
    use: { discs: [{ type: 'money', amount: 1 }] },
    benefits: [{ type: 'gold', amount: 1 }],
    maxUsesPerTurn: 3,
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
    benefits: [{ type: 'vp', amount: 3 }, { type: 'negativeVp', amount: 1 }],
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
      { type: 'negativeVp', amount: 1 },
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
    use: { discs: [{ type: 'gardener', amount: 2 }], gold: 1 },
    benefits: [{ type: 'vp', amount: 1 }],
  },
}

export function getCardOptions(def) {
  if (def.options) return def.options
  return [{ id: 'default', use: def.use, benefits: def.benefits, maxUsesPerTurn: def.maxUsesPerTurn ?? 1 }]
}

export const STARTING_TABLEAU = ['carousel', 'cashier']

export const MARKET_INITIAL_SUPPLY = Object.fromEntries(
  Object.keys(CARD_DEFS).map((id) => [id, 5])
)

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
