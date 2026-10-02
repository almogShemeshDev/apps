import { reactive, computed } from 'vue'
import {
  STARTING_BAG,
  STARTING_TABLEAU,
  MARKET_INITIAL_SUPPLY,
  CARD_DEFS,
  DISCS_PER_DRAW,
  shuffle,
} from '../constants.js'

let nextCardUid = 1

const state = reactive({
  phase: 'setup', // 'setup' | 'playing'
  players: [],
  activePlayerIndex: 0,
  round: 1,
  market: {},
  selectedDiscIndices: [],
})

const activePlayer = computed(() => state.players[state.activePlayerIndex])

function createPlayer(name) {
  return {
    name,
    bag: shuffle(STARTING_BAG),
    discard: [],
    drawn: [],
    gold: 0,
    vp: 0,
    tableau: STARTING_TABLEAU.map((cardId) => ({
      uid: nextCardUid++,
      cardId,
      usesThisTurn: 0,
    })),
  }
}

function maxUsesPerTurn(cardId) {
  return CARD_DEFS[cardId].maxUsesPerTurn ?? 1
}

function drawForActivePlayer() {
  const player = activePlayer.value
  player.drawn = []
  state.selectedDiscIndices = []
  for (let i = 0; i < DISCS_PER_DRAW; i++) {
    if (player.bag.length === 0) {
      if (player.discard.length === 0) break
      player.bag = shuffle(player.discard)
      player.discard = []
    }
    const idx = Math.floor(Math.random() * player.bag.length)
    player.drawn.push(player.bag.splice(idx, 1)[0])
  }
}

function startGame(playerNames) {
  state.players = playerNames.map((name) => createPlayer(name))
  state.activePlayerIndex = 0
  state.round = 1
  state.market = { ...MARKET_INITIAL_SUPPLY }
  state.selectedDiscIndices = []
  state.phase = 'playing'
  drawForActivePlayer()
}

function toggleDiscSelection(index) {
  const pos = state.selectedDiscIndices.indexOf(index)
  if (pos === -1) {
    state.selectedDiscIndices.push(index)
  } else {
    state.selectedDiscIndices.splice(pos, 1)
  }
}

function canActivateCard(card) {
  const player = activePlayer.value
  if (!player) return false
  if ((card.usesThisTurn ?? 0) >= maxUsesPerTurn(card.cardId)) return false

  const def = CARD_DEFS[card.cardId]
  const selectedDiscs = state.selectedDiscIndices.map((i) => player.drawn[i]).filter(Boolean)
  if (selectedDiscs.length !== def.use.amount) return false
  return selectedDiscs.every((d) => d === def.use.disc)
}

function activateCard(uid) {
  if (state.phase !== 'playing') return
  const player = activePlayer.value
  const card = player.tableau.find((c) => c.uid === uid)
  if (!card || !canActivateCard(card)) return

  const def = CARD_DEFS[card.cardId]
  const sortedIndices = [...state.selectedDiscIndices].sort((a, b) => b - a)
  for (const idx of sortedIndices) {
    player.discard.push(player.drawn.splice(idx, 1)[0])
  }
  state.selectedDiscIndices = []
  card.usesThisTurn = (card.usesThisTurn ?? 0) + 1

  if (def.benefit.type === 'gold') player.gold += def.benefit.amount
  if (def.benefit.type === 'vp') player.vp += def.benefit.amount
}

function canBuyCard(cardId) {
  const player = activePlayer.value
  if (!player) return false
  const def = CARD_DEFS[cardId]
  return state.market[cardId] > 0 && player.gold >= def.cost
}

function buyCard(cardId) {
  if (state.phase !== 'playing') return
  const player = activePlayer.value
  if (!canBuyCard(cardId)) return

  const def = CARD_DEFS[cardId]
  player.gold -= def.cost
  state.market[cardId] -= 1
  player.tableau.push({ uid: nextCardUid++, cardId, usesThisTurn: 0 })
}

function endTurn() {
  if (state.phase !== 'playing') return
  const player = activePlayer.value
  player.discard.push(...player.drawn)
  player.drawn = []
  player.gold = 0
  player.tableau.forEach((c) => (c.usesThisTurn = 0))
  state.selectedDiscIndices = []

  const nextIndex = (state.activePlayerIndex + 1) % state.players.length
  if (nextIndex === 0) state.round++
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
}

export function useGameState() {
  return {
    state,
    activePlayer,
    startGame,
    maxUsesPerTurn,
    toggleDiscSelection,
    canActivateCard,
    activateCard,
    canBuyCard,
    buyCard,
    endTurn,
    resetGame,
  }
}
