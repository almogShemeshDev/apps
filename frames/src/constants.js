export const CATEGORIES = {
  animals: { icon: '🐾', color: '#c98a3a' },
  food: { icon: '🍎', color: '#d97a4a' },
  people: { icon: '🧑', color: '#5b7a99' },
  landscapes: { icon: '🏔️', color: '#5a8a5e' },
  macro: { icon: '🔬', color: '#9a6bb0' },
  urban: { icon: '🏙️', color: '#6b8fb0' },
}

export const TRACKS = {
  creativity: { icon: '💡', color: '#d9b04a' },
  equipment: { icon: '📷', color: '#6b8fb0' },
  development: { icon: '🧪', color: '#7fa87f' },
  darkroom: { icon: '🌑', color: '#8a6a9a' },
}

export const STARTING_TIME_TOKENS = 5
export const MARKET_SIZE = 6
export const GAME_END_PHOTO_COUNT = 16

export const POINTS_PER_PHOTO = 1

// Sequence bonus for N consecutive same-theme developed photos in film order.
// Index = run length. Runs longer than the table gain +5 per additional photo.
export const SEQUENCE_BONUS_TABLE = [0, 0, 2, 5, 9, 14]
export const SEQUENCE_BONUS_PER_EXTRA = 5

export const VARIETY_BONUS_THEMES = 4
export const VARIETY_BONUS_POINTS = 5

export function sequenceBonusForLength(len) {
  if (len < 2) return 0
  if (len < SEQUENCE_BONUS_TABLE.length) return SEQUENCE_BONUS_TABLE[len]
  const last = SEQUENCE_BONUS_TABLE.length - 1
  return SEQUENCE_BONUS_TABLE[last] + (len - last) * SEQUENCE_BONUS_PER_EXTRA
}

// Each row: [time, equipment, creativity]. Every row has exactly 2 copies.
const CATEGORY_DISTRIBUTIONS = {
  animals: {
    subjects: [
      'Lion Portrait',
      'Soaring Eagle',
      'Tiger Stripes',
      'Elephant Herd',
      'Owl at Dusk',
      'Fox in Snow',
      'Wolf Pack',
      'Peacock Display',
      'Panda Close-up',
    ],
    rows: [
      [1, 1, 1],
      [2, 1, 1],
      [2, 2, 1],
      [2, 2, 2],
      [3, 2, 1],
      [3, 2, 2],
      [3, 3, 2],
      [4, 3, 2],
      [4, 3, 3],
    ],
  },
  food: {
    subjects: [
      'Morning Coffee',
      'Fresh Bread',
      'Street Noodles',
      'Fruit Stand',
      "Chef's Plate",
      'Spice Market',
      'Grilled Skewers',
      'Dessert Table',
      'Harvest Basket',
    ],
    rows: [
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 1],
      [2, 1, 2],
      [2, 2, 2],
      [3, 1, 2],
      [3, 2, 2],
      [3, 2, 3],
      [4, 2, 3],
    ],
  },
  people: {
    subjects: [
      'Candid Smile',
      'Crowd at Dusk',
      'Street Performer',
      'Market Vendor',
      'Family Portrait',
      'Festival Dancer',
      'Worker at Rest',
      "Child's Laughter",
      "Elder's Gaze",
    ],
    rows: [
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 2],
      [2, 1, 3],
      [2, 2, 2],
      [3, 1, 3],
      [3, 2, 3],
      [4, 2, 4],
      [4, 3, 4],
    ],
  },
  landscapes: {
    subjects: [
      'Misty Valley',
      'Sunset Horizon',
      'Desert Dunes',
      'Mountain Ridge',
      'Coastal Cliffs',
      'Autumn Forest',
      'Snowy Peak',
      'Rolling Hills',
      'Northern Lights',
    ],
    rows: [
      [1, 1, 0],
      [2, 1, 1],
      [2, 2, 1],
      [2, 2, 2],
      [3, 2, 2],
      [3, 3, 2],
      [3, 3, 3],
      [4, 3, 2],
      [4, 4, 3],
    ],
  },
  macro: {
    subjects: [
      'Dew Drop',
      'Insect Eye',
      'Flower Petal',
      'Leaf Vein',
      'Butterfly Wing',
      'Frost Pattern',
      'Water Droplet',
      'Pollen Grain',
      'Spider Web',
    ],
    rows: [
      [1, 1, 1],
      [2, 2, 1],
      [2, 2, 2],
      [3, 2, 2],
      [3, 3, 2],
      [3, 3, 3],
      [4, 3, 3],
      [4, 4, 2],
      [4, 4, 3],
    ],
  },
  urban: {
    subjects: [
      'Rainy Crosswalk',
      'Neon Alley',
      'Rooftop View',
      'Subway Platform',
      'Night Market',
      'Graffiti Wall',
      'Bridge at Night',
      'Skyline Silhouette',
      'Construction Site',
    ],
    rows: [
      [1, 0, 1],
      [1, 1, 1],
      [2, 1, 1],
      [2, 1, 2],
      [2, 2, 1],
      [3, 2, 2],
      [3, 2, 3],
      [3, 3, 2],
      [4, 3, 3],
    ],
  },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildTileDeck() {
  const tiles = []
  let id = 0
  for (const [category, { subjects, rows }] of Object.entries(CATEGORY_DISTRIBUTIONS)) {
    rows.forEach(([cost, reqEquipment, reqCreativity], rowIndex) => {
      for (let copy = 0; copy < 2; copy++) {
        tiles.push({
          id: id++,
          category,
          subject: subjects[rowIndex],
          cost,
          reqEquipment,
          reqCreativity,
        })
      }
    })
  }
  return shuffle(tiles)
}
