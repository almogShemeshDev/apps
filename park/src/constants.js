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

export const CARD_DEFS = {
  carousel: {
    id: 'carousel',
    icon: '🎠',
    cost: 2,
    use: { disc: 'visitor', amount: 1 },
    benefit: { type: 'vp', amount: 1 },
  },
  cashier: {
    id: 'cashier',
    icon: '💵',
    cost: 2,
    use: { disc: 'money', amount: 1 },
    benefit: { type: 'gold', amount: 1 },
    maxUsesPerTurn: 3,
  },
}

export const STARTING_TABLEAU = ['carousel', 'cashier']

export const MARKET_INITIAL_SUPPLY = { carousel: 5, cashier: 5 }

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
