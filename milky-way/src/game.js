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

function emptyFruits() {
  return Object.fromEntries(FRUITS.map(f => [f, 0]))
}

function rollDice(n) {
  return Array.from({ length: n }, () => FRUITS[Math.floor(Math.random() * FRUITS.length)])
}

export function useGame() {
  const state = reactive({
    phase: 'setup',       // 'setup' | 'turn' | 'end'
    round: 1,             // 1–6
    activePlayerIdx: 0,
    players: [],          // [{ name, fruits: { banana:0, ... } }]
    dice: [],             // current dice in play (shrinks on each continue)
    selectedFruits: [],   // fruit types active player chose this roll
    committedFruits: [],  // locked after first continue
    savedFruitCounts: emptyFruits(), // dice accumulated across continues this turn
    rolled: false,
    log: [],
  })

  const activePlayer = computed(() => state.players[state.activePlayerIdx])

  // Count of each fruit type in the current dice
  const diceGroups = computed(() => {
    const g = {}
    for (const f of FRUITS) g[f] = state.dice.filter(d => d === f).length
    return g
  })

  // Dice count for currently selected fruit types
  const selectedDiceCount = computed(() =>
    state.selectedFruits.reduce((s, f) => s + (diceGroups.value[f] || 0), 0)
  )

  // Dice not selected in the current roll (will go to opponents on stop)
  const nonSelectedDiceCount = computed(() => state.dice.length - selectedDiceCount.value)

  // Total dice saved across all continues this turn
  const totalSavedCount = computed(() =>
    Object.values(state.savedFruitCounts).reduce((s, n) => s + n, 0)
  )

  // True when committed fruit didn't appear — player must stop/pass
  const mustStop = computed(() =>
    state.rolled &&
    state.committedFruits.length > 0 &&
    state.committedFruits.every(f => !diceGroups.value[f])
  )

  function canSelectFruit(fruit) {
    if (!diceGroups.value[fruit]) return false
    if (state.committedFruits.length > 0 && !state.committedFruits.includes(fruit)) return false
    return true
  }

  function roll() {
    state.dice = rollDice(6)
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

  function continueNext() {
    // Lock fruit type on first continue
    if (state.committedFruits.length === 0) {
      state.committedFruits = [...state.selectedFruits]
    }

    // Accumulate selected dice into saved pool
    for (const fruit of state.selectedFruits) {
      state.savedFruitCounts[fruit] += diceGroups.value[fruit] || 0
    }

    const rerollCount = nonSelectedDiceCount.value

    state.log.unshift(
      `${activePlayer.value.name}: saved ${_savedStr()}, rolling ${rerollCount} dice`
    )
    if (state.log.length > 40) state.log.pop()

    // Re-roll only the non-selected (leftover) dice
    state.dice = rollDice(rerollCount)
    state.selectedFruits = []
    state.rolled = true
  }

  function stop() {
    const player = activePlayer.value

    // Collect all saved fruits from previous continues
    for (const [f, n] of Object.entries(state.savedFruitCounts)) {
      player.fruits[f] += n
    }
    // Collect currently selected fruits
    for (const fruit of state.selectedFruits) {
      player.fruits[fruit] += diceGroups.value[fruit] || 0
    }

    // All non-selected current dice go to each opponent
    const discarded = {}
    for (const f of FRUITS) {
      if (!state.selectedFruits.includes(f) && diceGroups.value[f] > 0) {
        discarded[f] = diceGroups.value[f]
      }
    }
    for (let i = 0; i < state.players.length; i++) {
      if (i !== state.activePlayerIdx) {
        for (const [f, n] of Object.entries(discarded)) {
          state.players[i].fruits[f] += n
        }
      }
    }

    // Log
    const keptParts = [
      ...Object.entries(state.savedFruitCounts).filter(([, n]) => n > 0).map(([f, n]) => `${FRUIT_EMOJI[f]}×${n}`),
      ...state.selectedFruits.filter(f => diceGroups.value[f] > 0).map(f => `${FRUIT_EMOJI[f]}×${diceGroups.value[f]}`),
    ]
    const dStr = Object.entries(discarded).map(([f, n]) => `${FRUIT_EMOJI[f]}×${n}`).join(' ')
    state.log.unshift(
      `${player.name}: kept ${keptParts.join(' ') || '—'}${dStr ? `  →  ${dStr} to others` : ''}`
    )
    if (state.log.length > 40) state.log.pop()

    _advancePlayer()
  }

  function _savedStr() {
    return Object.entries(state.savedFruitCounts)
      .filter(([, n]) => n > 0)
      .map(([f, n]) => `${FRUIT_EMOJI[f]}×${n}`)
      .join(' ') || '—'
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
    state.dice = []
    state.selectedFruits = []
    state.committedFruits = []
    state.savedFruitCounts = emptyFruits()
    state.rolled = false
  }

  function startGame(playerNames) {
    state.players = playerNames.map(name => ({
      name,
      fruits: emptyFruits(),
    }))
    state.phase = 'turn'
    state.round = 1
    state.activePlayerIdx = 0
    state.dice = []
    state.selectedFruits = []
    state.committedFruits = []
    state.savedFruitCounts = emptyFruits()
    state.rolled = false
    state.log = []
  }

  function resetGame() {
    Object.assign(state, {
      phase: 'setup',
      round: 1,
      activePlayerIdx: 0,
      players: [],
      dice: [],
      selectedFruits: [],
      committedFruits: [],
      savedFruitCounts: emptyFruits(),
      rolled: false,
      log: [],
    })
  }

  // --- End-game scoring ---

  const fruitWinners = computed(() => {
    if (state.phase !== 'end') return {}
    const result = {}
    for (const fruit of FRUITS) {
      let max = -1, winner = null, tied = false
      for (const p of state.players) {
        if (p.fruits[fruit] > max) { max = p.fruits[fruit]; winner = p.name; tied = false }
        else if (p.fruits[fruit] === max && max > 0) { tied = true }
      }
      result[fruit] = tied ? null : winner
    }
    return result
  })

  const playerMajorities = computed(() => {
    const counts = Object.fromEntries(state.players.map(p => [p.name, 0]))
    for (const w of Object.values(fruitWinners.value)) {
      if (w) counts[w]++
    }
    return counts
  })

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
    activePlayer,
    diceGroups,
    selectedDiceCount,
    nonSelectedDiceCount,
    totalSavedCount,
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
