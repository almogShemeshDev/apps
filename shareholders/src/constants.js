// Shareholders is a card-drafting game: a shared deck of 60 cards made of 5
// train companies, each with 6 share cards and 6 train cards. Shares are
// collected privately by whoever drafts them; trains always join a shared
// pool for their company, no matter who drafts them.
export const COMPANIES = {
  red: { id: 'red', icon: '🔴' },
  blue: { id: 'blue', icon: '🔵' },
  green: { id: 'green', icon: '🟢' },
  yellow: { id: 'yellow', icon: '🟡' },
  purple: { id: 'purple', icon: '🟣' },
}

export const COMPANY_IDS = Object.keys(COMPANIES)

export const COPIES_PER_TYPE = 6

export const SHARE_ICON = '💰'
export const TRAIN_ICON = '🚂'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 6

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function emptyCompanyCounts() {
  return Object.fromEntries(COMPANY_IDS.map((id) => [id, 0]))
}

// Companies tied for the fewest trains in the shared pool score as zero,
// whether the game is still running (a live preview) or just ended.
export function computeLowestCompanies(pool) {
  const min = Math.min(...COMPANY_IDS.map((id) => pool[id]))
  return COMPANY_IDS.filter((id) => pool[id] === min)
}

export function computeScore(shares, pool, lowestIds) {
  return COMPANY_IDS.reduce((sum, id) => {
    const value = shares[id] * pool[id]
    return sum + (lowestIds.includes(id) ? -value : value)
  }, 0)
}

export function buildDeck() {
  let uid = 1
  const deck = []
  for (const company of COMPANY_IDS) {
    for (let i = 0; i < COPIES_PER_TYPE; i++) {
      deck.push({ uid: uid++, kind: 'share', company })
      deck.push({ uid: uid++, kind: 'train', company })
    }
  }
  return shuffle(deck)
}
