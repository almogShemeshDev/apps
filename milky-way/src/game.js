import { reactive, computed } from 'vue'

export const FRUITS = ['banana', 'cacao', 'strawberry', 'grapefruit', 'carrot']

export const FRUIT_EMOJI = {
  banana: '🍌',
  cacao: '🍫',
  strawberry: '🍓',
  grapefruit: '🍊',
  carrot: '🥕',
}

export const FRUIT_COLOR = {
  banana: '#f5c200',
  cacao: '#a0623a',
  strawberry: '#e8305a',
  grapefruit: '#ff8c00',
  carrot: '#ff5c35',
}

// Each card: how many dice the active player keeps vs gives to others
// keep + discard = 6 always
export const CARDS = [
  { id: 1, keep: 6, discard: 0 },
  { id: 2, keep: 4, discard: 2 },
  { id: 3, keep: 2, discard: 4 },
  { id: 4, keep: 5, discard: 1 },
  { id: 5, keep: 4, discard: 2 },
  { id: 6, keep: 3, discard: 3 },
]

export function useGame() {
  const state = reactive({
    phase: 'setup',       // 'setup' | 'turn' | 'end'
    round: 1,             // 1–6
    activePlayerIdx: 0,
    cardIdx: 0,           // 0–5 (maps to CARDS)
    players: [],          // [{ name, fruits: { banana:0, ... } }]
    dice: [],             // fruit strings, 6 values after rolling
    selectedFruits: [],   // fruit types the active player chose to keep
    committedFruits: [],  // locked-in types after first continue (empty = free choice)
    rolled: false,
    log: [],
  })

  const card = computed(() => CARDS[state.cardIdx])
  const activePlayer = computed(() => state.players[state.activePlayerIdx])

  // Count of each fruit type in the current dice roll
  const diceGroups = computed(() => {
    const g = {}
    for (const f of FRUITS) g[f] = state.dice.filter(d => d === f).length
    return g
  })

  // Total dice count across all selected fruit types
  const selectedDiceCount = computed(() =>
    state.selectedFruits.reduce((s, f) => s + (diceGroups.value[f] || 0), 0)
  )

  // True when the player has committed to specific fruits but none appear in this roll
  const mustStop = computed(() =>
    state.rolled &&
    state.committedFruits.length > 0 &&
    state.committedFruits.every(f => !diceGroups.value[f])
  )

  // Whether a fruit type can be added to the selection
  function canSelectFruit(fruit) {
    if (!diceGroups.value[fruit]) return false
    // After first continue, only committed types are allowed
    if (state.committedFruits.length > 0 && !state.committedFruits.includes(fruit)) return false
    if (state.selectedFruits.includes(fruit)) return true // can always deselect
    if (state.selectedFruits.length === 0) return true    // first selection always allowed
    return selectedDiceCount.value + (diceGroups.value[fruit] || 0) <= card.value.keep
  }

  function roll() {
    state.dice = Array.from({ length: 6 }, () =>
      FRUITS[Math.floor(Math.random() * FRUITS.length)]
    )
    state.selectedFruits = []
    state.rolled = true
  }

  function toggleFruit(fruit) {
    if (!state.rolled) return
    const idx = state.selectedFruits.indexOf(fruit)
    if (idx >= 0) {
      state.selectedFruits.splice(idx, 1)
    } else if (canSelectFruit(fruit)) {
      state.selectedFruits.push(fruit)
    }
  }

  // Apply current card results: give kept fruits to active player, discarded to others
  function _applyCard() {
    const player = activePlayer.value
    const c = card.value

    // Active player collects kept fruits (capped at card.keep)
    let keepCap = c.keep
    for (const fruit of state.selectedFruits) {
      const n = Math.min(diceGroups.value[fruit] || 0, keepCap)
      player.fruits[fruit] += n
      keepCap -= n
      if (keepCap <= 0) break
    }

    // Unselected dice go to all other players (up to card.discard each)
    let discardCap = c.discard
    const discarded = {}
    for (const fruit of FRUITS) {
      if (!state.selectedFruits.includes(fruit) && discardCap > 0) {
        const n = Math.min(diceGroups.value[fruit] || 0, discardCap)
        if (n > 0) { discarded[fruit] = n; discardCap -= n }
      }
    }
    for (let i = 0; i < state.players.length; i++) {
      if (i !== state.activePlayerIdx) {
        for (const [f, n] of Object.entries(discarded)) {
          state.players[i].fruits[f] += n
        }
      }
    }

    // Build log entry
    const kStr = state.selectedFruits
      .map(f => `${FRUIT_EMOJI[f]}×${Math.min(diceGroups.value[f], c.keep)}`)
      .join(' ')
    const dStr = Object.entries(discarded)
      .map(([f, n]) => `${FRUIT_EMOJI[f]}×${n}`)
      .join(' ')
    state.log.unshift(
      `${player.name} [Card ${c.id}]: kept ${kStr || '—'}${dStr ? `  →  ${dStr} to others` : ''}`
    )
    if (state.log.length > 40) state.log.pop()
  }

  function stop() {
    _applyCard()
    _advancePlayer()
  }

  function continueNext() {
    // Lock the fruit types the player is committing to on the first continue
    if (state.committedFruits.length === 0) {
      state.committedFruits = [...state.selectedFruits]
    }
    _applyCard()
    state.cardIdx++
    state.dice = []
    state.selectedFruits = []
    state.rolled = false
  }

  function _advancePlayer() {
    const nextIdx = (state.activePlayerIdx + 1) % state.players.length
    const wraps = nextIdx === 0
    if (wraps && state.round >= 6) {
      state.phase = 'end'
      return
    }
    if (wraps) state.round++
    state.activePlayerIdx = nextIdx
    state.cardIdx = 0
    state.dice = []
    state.selectedFruits = []
    state.committedFruits = []
    state.rolled = false
  }

  function startGame(playerNames) {
    state.players = playerNames.map(name => ({
      name,
      fruits: Object.fromEntries(FRUITS.map(f => [f, 0])),
    }))
    state.phase = 'turn'
    state.round = 1
    state.activePlayerIdx = 0
    state.cardIdx = 0
    state.rolled = false
    state.log = []
  }

  function resetGame() {
    Object.assign(state, {
      phase: 'setup',
      round: 1,
      activePlayerIdx: 0,
      cardIdx: 0,
      players: [],
      dice: [],
      selectedFruits: [],
      committedFruits: [],
      rolled: false,
      log: [],
    })
  }

  // --- End-game scoring ---

  // For each fruit, who collected the most? null = tie
  const fruitWinners = computed(() => {
    if (state.phase !== 'end') return {}
    const result = {}
    for (const fruit of FRUITS) {
      let max = -1, winner = null, tied = false
      for (const p of state.players) {
        if (p.fruits[fruit] > max) { max = p.fruits[fruit]; winner = p.name; tied = false }
        else if (p.fruits[fruit] === max && max >= 0) { tied = true }
      }
      result[fruit] = tied ? null : winner
    }
    return result
  })

  // How many fruit majorities each player won
  const playerMajorities = computed(() => {
    const counts = Object.fromEntries(state.players.map(p => [p.name, 0]))
    for (const w of Object.values(fruitWinners.value)) {
      if (w) counts[w]++
    }
    return counts
  })

  // Overall winner: most fruit majorities. null = tie
  const overallWinner = computed(() => {
    if (state.phase !== 'end') return null
    let max = -1, winner = null, tied = false
    for (const [name, count] of Object.entries(playerMajorities.value)) {
      if (count > max) { max = count; winner = name; tied = false }
      else if (count === max) { tied = true }
    }
    return tied ? null : winner
  })

  return {
    state,
    card,
    activePlayer,
    diceGroups,
    selectedDiceCount,
    mustStop,
    canSelectFruit,
    fruitWinners,
    playerMajorities,
    overallWinner,
    roll,
    toggleFruit,
    stop,
    continueNext,
    startGame,
    resetGame,
  }
}
