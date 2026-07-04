export const CATEGORIES = {
  portrait: { icon: '🧑', color: '#d97a4a' },
  landscape: { icon: '🏔️', color: '#5a8a5e' },
  street: { icon: '🏙️', color: '#5b7a99' },
  stillLife: { icon: '🍎', color: '#c98a3a' },
  abstract: { icon: '🌀', color: '#9a6bb0' },
}

export const TRACKS = {
  creativity: { icon: '💡', color: '#d9b04a' },
  equipment: { icon: '📷', color: '#6b8fb0' },
  knowledge: { icon: '📖', color: '#7fa87f' },
  darkroom: { icon: '🌑', color: '#8a6a9a' },
}

export const STARTING_TIME_TOKENS = 5
export const MARKET_SIZE = 4
export const TILES_PER_PLAYER = 24
export const MIN_RUN_LENGTH = 3
export const RUN_BONUS_PER_TILE = 2

const PHOTO_TEMPLATES = [
  { category: 'portrait', subject: 'Golden Hour Portrait', cost: 1, reqCreativity: 0, reqEquipment: 0 },
  { category: 'portrait', subject: 'Candid Smile', cost: 1, reqCreativity: 0, reqEquipment: 1 },
  { category: 'portrait', subject: 'Studio Headshot', cost: 2, reqCreativity: 1, reqEquipment: 1 },
  { category: 'portrait', subject: 'Backlit Silhouette', cost: 3, reqCreativity: 2, reqEquipment: 1 },
  { category: 'portrait', subject: 'Macro Eye Study', cost: 4, reqCreativity: 2, reqEquipment: 3 },

  { category: 'landscape', subject: 'Misty Valley', cost: 1, reqCreativity: 0, reqEquipment: 0 },
  { category: 'landscape', subject: 'Sunset Horizon', cost: 2, reqCreativity: 1, reqEquipment: 0 },
  { category: 'landscape', subject: 'Desert Dunes', cost: 2, reqCreativity: 1, reqEquipment: 1 },
  { category: 'landscape', subject: 'Mountain Ridge', cost: 3, reqCreativity: 1, reqEquipment: 2 },
  { category: 'landscape', subject: 'Long Exposure Waterfall', cost: 4, reqCreativity: 2, reqEquipment: 3 },

  { category: 'street', subject: 'Rainy Crosswalk', cost: 1, reqCreativity: 0, reqEquipment: 0 },
  { category: 'street', subject: 'Market Vendor', cost: 1, reqCreativity: 0, reqEquipment: 1 },
  { category: 'street', subject: 'Subway Motion Blur', cost: 2, reqCreativity: 2, reqEquipment: 1 },
  { category: 'street', subject: 'Night Market', cost: 3, reqCreativity: 1, reqEquipment: 2 },
  { category: 'street', subject: 'Neon Reflection', cost: 4, reqCreativity: 3, reqEquipment: 2 },

  { category: 'stillLife', subject: 'Fruit Bowl', cost: 1, reqCreativity: 0, reqEquipment: 0 },
  { category: 'stillLife', subject: 'Flowers in a Vase', cost: 2, reqCreativity: 0, reqEquipment: 1 },
  { category: 'stillLife', subject: 'Vintage Books', cost: 2, reqCreativity: 1, reqEquipment: 0 },
  { category: 'stillLife', subject: 'Candlelit Table', cost: 3, reqCreativity: 1, reqEquipment: 2 },
  { category: 'stillLife', subject: 'Broken Watch', cost: 3, reqCreativity: 2, reqEquipment: 1 },

  { category: 'abstract', subject: 'Light Leak', cost: 1, reqCreativity: 1, reqEquipment: 0 },
  { category: 'abstract', subject: 'Water Ripple', cost: 2, reqCreativity: 2, reqEquipment: 0 },
  { category: 'abstract', subject: 'Shadow Pattern', cost: 2, reqCreativity: 1, reqEquipment: 1 },
  { category: 'abstract', subject: 'Prism Refraction', cost: 3, reqCreativity: 2, reqEquipment: 2 },
  { category: 'abstract', subject: 'Double Exposure', cost: 4, reqCreativity: 3, reqEquipment: 2 },
]

const UPGRADE_TEMPLATES = [
  { track: 'creativity', name: 'Vision Workshop', cost: 1 },
  { track: 'creativity', name: 'Composition Study', cost: 2 },
  { track: 'creativity', name: 'Color Theory Course', cost: 2 },
  { track: 'creativity', name: 'Master Class', cost: 3 },

  { track: 'equipment', name: 'Used Lens', cost: 1 },
  { track: 'equipment', name: 'Tripod', cost: 2 },
  { track: 'equipment', name: 'Prime Lens', cost: 2 },
  { track: 'equipment', name: 'Full Kit Upgrade', cost: 3 },

  { track: 'knowledge', name: 'Exposure Notes', cost: 1 },
  { track: 'knowledge', name: 'Chemistry Basics', cost: 1 },
  { track: 'knowledge', name: 'Technique Journal', cost: 2 },
  { track: 'knowledge', name: 'Mentor Session', cost: 2 },

  { track: 'darkroom', name: 'Safelight', cost: 1 },
  { track: 'darkroom', name: 'Extra Tray', cost: 2 },
  { track: 'darkroom', name: 'Timer', cost: 2 },
  { track: 'darkroom', name: 'Enlarger', cost: 3 },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildTileDeck(playerCount) {
  const targetCount = playerCount * TILES_PER_PLAYER
  const tiles = []
  for (let i = 0; i < targetCount; i++) {
    const photo = PHOTO_TEMPLATES[i % PHOTO_TEMPLATES.length]
    const upgrade = UPGRADE_TEMPLATES[(i * 7 + 3) % UPGRADE_TEMPLATES.length]
    tiles.push({
      id: i,
      photo: { ...photo },
      upgrade: { ...upgrade },
    })
  }
  return shuffle(tiles)
}
