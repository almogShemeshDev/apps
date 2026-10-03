import { reactive, computed } from 'vue'
import {
  STARTING_BAG,
  STARTING_TABLEAU,
  MARKET_INITIAL_SUPPLY,
  CARD_DEFS,
  DISCS_PER_DRAW,
  VICTORY_VP,
  SOLO_TURN_LIMIT,
  getCardOptions,
  shuffle,
} from '../constants.js'

let nextCardUid = 1

const state = reactive({
  phase: 'setup', // 'setup' | 'playing' | 'game-over'
  players: [],
  activePlayerIndex: 0,
  round: 1,
  market: {},
  selectedDiscIndices: [],
  pendingChoice: null, // { kind: 'discard' | 'trash', remaining, filter? }
  winTriggerRound: null, // multiplayer only: round the 25VP threshold was first crossed
  outcome: null, // solo only: 'win' | 'loss'
})

const activePlayer = computed(() => state.players[state.activePlayerIndex])
const isSolo = computed(() => state.players.length === 1)

function initUsesThisTurn(cardId) {
  const options = getCardOptions(CARD_DEFS[cardId])
  return Object.fromEntries(options.map((o) => [o.id, 0]))
}

function createPlayer(name) {
  return {
    name,
    bag: shuffle(STARTING_BAG),
    discard: [],
    drawn: [],
    gold: 0,
    vp: 0,
    trashedCount: 0,
    tableau: STARTING_TABLEAU.map((cardId) => ({
      uid: nextCardUid++,
      cardId,
      usesThisTurn: initUsesThisTurn(cardId),
    })),
  }
}

function drawNInto(player, n) {
  for (let i = 0; i < n; i++) {
    if (player.bag.length === 0) {
      if (player.discard.length === 0) break
      player.bag = shuffle(player.discard)
      player.discard = []
    }
    const idx = Math.floor(Math.random() * player.bag.length)
    player.drawn.push(player.bag.splice(idx, 1)[0])
  }
}

function drawForActivePlayer() {
  const player = activePlayer.value
  player.drawn = []
  state.selectedDiscIndices = []
  state.pendingChoice = null
  drawNInto(player, DISCS_PER_DRAW)
}

function startGame(playerNames) {
  state.players = playerNames.map((name) => createPlayer(name))
  state.activePlayerIndex = 0
  state.round = 1
  state.market = { ...MARKET_INITIAL_SUPPLY }
  state.selectedDiscIndices = []
  state.pendingChoice = null
  state.winTriggerRound = null
  state.outcome = null
  state.phase = 'playing'
  drawForActivePlayer()
}

function resolvePendingChoice(index) {
  const player = activePlayer.value
  if (index < 0 || index >= player.drawn.length) return
  if (state.pendingChoice.filter && player.drawn[index] !== state.pendingChoice.filter) return
  const [disc] = player.drawn.splice(index, 1)
  if (state.pendingChoice.kind === 'discard') {
    player.discard.push(disc)
  } else if (state.pendingChoice.kind === 'trash') {
    player.trashedCount++
  }
  state.pendingChoice.remaining--
  if (state.pendingChoice.remaining <= 0) state.pendingChoice = null
}

function toggleDiscSelection(index) {
  if (state.pendingChoice) {
    resolvePendingChoice(index)
    return
  }
  const pos = state.selectedDiscIndices.indexOf(index)
  if (pos === -1) state.selectedDiscIndices.push(index)
  else state.selectedDiscIndices.splice(pos, 1)
}

function requiredDiscMultiset(use) {
  const map = {}
  for (const d of use.discs) map[d.type] = (map[d.type] ?? 0) + d.amount
  return map
}

function selectedDiscMultiset(player) {
  const map = {}
  for (const idx of state.selectedDiscIndices) {
    const disc = player.drawn[idx]
    if (disc === undefined) continue
    map[disc] = (map[disc] ?? 0) + 1
  }
  return map
}

function multisetsEqual(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const k of keys) {
    if ((a[k] ?? 0) !== (b[k] ?? 0)) return false
  }
  return true
}

function findOption(cardId, optionId) {
  return getCardOptions(CARD_DEFS[cardId]).find((o) => o.id === optionId)
}

function canActivateOption(card, optionId) {
  if (state.pendingChoice) return false
  const player = activePlayer.value
  if (!player) return false
  const option = findOption(card.cardId, optionId)
  if (!option) return false

  const maxUses = option.maxUsesPerTurn ?? 1
  if ((card.usesThisTurn[optionId] ?? 0) >= maxUses) return false
  if (option.use.gold && player.gold < option.use.gold) return false

  const required = requiredDiscMultiset(option.use)
  const selected = selectedDiscMultiset(player)
  return multisetsEqual(required, selected)
}

function checkWinTrigger(player) {
  if (!isSolo.value && state.winTriggerRound === null && player.vp >= VICTORY_VP) {
    state.winTriggerRound = state.round
  }
}

function activateOption(uid, optionId) {
  if (state.phase !== 'playing') return
  const player = activePlayer.value
  const card = player.tableau.find((c) => c.uid === uid)
  if (!card || !canActivateOption(card, optionId)) return
  const option = findOption(card.cardId, optionId)

  if (option.use.gold) player.gold -= option.use.gold
  const sortedIndices = [...state.selectedDiscIndices].sort((a, b) => b - a)
  for (const idx of sortedIndices) {
    player.discard.push(player.drawn.splice(idx, 1)[0])
  }
  state.selectedDiscIndices = []
  card.usesThisTurn[optionId] = (card.usesThisTurn[optionId] ?? 0) + 1

  let pendingDiscard = 0
  let pendingTrash = null // { amount, filter? }
  for (const effect of option.benefits) {
    if (effect.type === 'vp') {
      player.vp += effect.amount
      checkWinTrigger(player)
    } else if (effect.type === 'gold') player.gold += effect.amount
    else if (effect.type === 'gainDisc') {
      for (let i = 0; i < effect.amount; i++) player.discard.push(effect.disc)
    } else if (effect.type === 'drawDiscs') drawNInto(player, effect.amount)
    else if (effect.type === 'discardDiscs') pendingDiscard += effect.amount
    else if (effect.type === 'trashDiscs') {
      if (effect.filter) {
        const hasMatch = player.drawn.some((d) => d === effect.filter)
        if (hasMatch) pendingTrash = { amount: (pendingTrash?.amount ?? 0) + effect.amount, filter: effect.filter }
      } else {
        pendingTrash = { amount: (pendingTrash?.amount ?? 0) + effect.amount, filter: pendingTrash?.filter }
      }
    }
  }

  if (pendingDiscard > 0) state.pendingChoice = { kind: 'discard', remaining: pendingDiscard }
  else if (pendingTrash) state.pendingChoice = { kind: 'trash', remaining: pendingTrash.amount, filter: pendingTrash.filter }
}

function canBuyCard(cardId) {
  const player = activePlayer.value
  if (!player || state.pendingChoice) return false
  const def = CARD_DEFS[cardId]
  return (state.market[cardId] ?? 0) > 0 && player.gold >= def.cost
}

function buyCard(cardId) {
  if (state.phase !== 'playing') return
  const player = activePlayer.value
  if (!canBuyCard(cardId)) return

  const def = CARD_DEFS[cardId]
  player.gold -= def.cost
  state.market[cardId] -= 1
  player.tableau.push({ uid: nextCardUid++, cardId, usesThisTurn: initUsesThisTurn(cardId) })
}

function endTurn() {
  if (state.phase !== 'playing' || state.pendingChoice) return
  const player = activePlayer.value
  player.discard.push(...player.drawn)
  player.drawn = []
  player.gold = 0
  player.tableau.forEach((c) => {
    for (const key in c.usesThisTurn) c.usesThisTurn[key] = 0
  })
  state.selectedDiscIndices = []

  const nextIndex = (state.activePlayerIndex + 1) % state.players.length

  if (nextIndex === 0) {
    if (isSolo.value) {
      if (player.vp >= VICTORY_VP) {
        state.phase = 'game-over'
        state.outcome = 'win'
        return
      }
      if (state.round >= SOLO_TURN_LIMIT) {
        state.phase = 'game-over'
        state.outcome = 'loss'
        return
      }
    } else if (state.winTriggerRound !== null) {
      state.phase = 'game-over'
      return
    }
    state.round++
  }
  state.activePlayerIndex = nextIndex
  drawForActivePlayer()
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.activePlayerIndex = 0
  state.round = 1
  state.market = {}
  state.selectedDiscIndices = []
  state.pendingChoice = null
  state.winTriggerRound = null
  state.outcome = null
}

export function useGameState() {
  return {
    state,
    activePlayer,
    isSolo,
    startGame,
    toggleDiscSelection,
    canActivateOption,
    activateOption,
    canBuyCard,
    buyCard,
    endTurn,
    resetGame,
  }
}
