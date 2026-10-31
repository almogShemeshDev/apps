import { reactive, computed } from 'vue'
import { buildDeck } from '../game/deck.js'
import { windowForLevel, advanceLevel, retreatLevel, START_LEVEL } from '../game/windows.js'
import { SPECIALS_BY_ID } from '../game/specials.js'
import { instancePrice } from '../game/probability.js'
import { categoriesInCards, scoreForCategoryCount } from '../game/scoring.js'

let nextLogId = 1

function freshTurnEffects() {
  return { couponCount: 0, taxInsuranceCount: 0, flashSaleDiscounts: {}, sneakPeekInstanceId: null }
}

const state = reactive({
  phase: 'setup', // 'setup' | 'playing' | 'game-over'
  players: [], // { id, name, isBot, vp, productsWon: [defId,...], specialInventory: [{instanceId, defId}] }
  deck: [], // array of card instances, index 0 = top of deck
  discard: [],
  windowLevel: START_LEVEL,
  turnIndex: 0,
  turnNumber: 1,
  roundStartIndex: 0,
  finalRoundActive: false, // deck is empty; play continues until the round completes
  order: { cards: [] }, // active player's current shopping cart
  turnEffects: freshTurnEffects(),
  log: [], // [{ id, type, turn, ...typeSpecificData }], oldest first
})

function pushLog(type, data) {
  state.log.push({ id: nextLogId++, type, turn: state.turnNumber, ...data })
}

const turnPlayer = computed(() => state.players[state.turnIndex])
const currentWindow = computed(() => windowForLevel(state.windowLevel))

// Per-card effective price after any Flash Sale discounts, floored at 0.
function effectivePriceOf(instance) {
  const discount = state.turnEffects.flashSaleDiscounts[instance.instanceId] ?? 0
  return Math.max(0, instancePrice(instance) - discount)
}

const rawTotal = computed(() => state.order.cards.reduce((sum, c) => sum + effectivePriceOf(c), 0))
const effectiveTotal = computed(() => Math.max(0, rawTotal.value - state.turnEffects.couponCount * 3))
const minLimit = computed(() => currentWindow.value.min)
const maxLimit = computed(() => currentWindow.value.max + state.turnEffects.taxInsuranceCount * 5)
const windowStatus = computed(() => {
  if (effectiveTotal.value < minLimit.value) return 'below'
  if (effectiveTotal.value > maxLimit.value) return 'above'
  return 'within'
})

// Shipment scoring: VP is earned by distinct product categories in the
// cart, not by summing individual products (specials never count).
const collectedCategories = computed(() => categoriesInCards(state.order.cards))
const potentialVp = computed(() => scoreForCategoryCount(collectedCategories.value.size))

// The most recently drawn product still present in the cart (Free Return's target).
const freeReturnTarget = computed(() => {
  for (let i = state.order.cards.length - 1; i >= 0; i--) {
    if (state.order.cards[i].type === 'product') return state.order.cards[i]
  }
  return null
})

const peekedCard = computed(() => {
  const id = state.turnEffects.sneakPeekInstanceId
  if (!id) return null
  return state.deck.find((c) => c.instanceId === id) ?? null
})

function createPlayer(input) {
  const name = typeof input === 'string' ? input : input.name
  const isBot = typeof input === 'string' ? false : !!input.isBot
  return { name, isBot, vp: 0, productsWon: [], specialInventory: [] }
}

function startGame(playerInputs) {
  state.players = playerInputs.map(createPlayer)
  state.deck = buildDeck()
  state.discard = []
  state.windowLevel = START_LEVEL
  state.turnIndex = 0
  state.turnNumber = 1
  state.roundStartIndex = 0
  state.finalRoundActive = false
  state.order = { cards: [] }
  state.turnEffects = freshTurnEffects()
  state.log = []
  state.phase = 'playing'
  pushLog('turn-start', { playerName: state.players[0].name })
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.deck = []
  state.discard = []
  state.windowLevel = START_LEVEL
  state.turnIndex = 0
  state.turnNumber = 1
  state.roundStartIndex = 0
  state.finalRoundActive = false
  state.order = { cards: [] }
  state.turnEffects = freshTurnEffects()
  state.log = []
}

function nextTurn() {
  const n = state.players.length
  state.order = { cards: [] }
  state.turnEffects = freshTurnEffects()
  state.turnIndex = (state.turnIndex + 1) % n
  state.turnNumber++
  if (state.finalRoundActive && state.turnIndex === state.roundStartIndex) {
    state.phase = 'game-over'
    pushLog('game-over', {})
  } else {
    pushLog('turn-start', { playerName: state.players[state.turnIndex].name })
  }
}

// --- Draw / Ship / Fail ---

function canDraw() {
  return state.phase === 'playing' && windowStatus.value !== 'above' && state.deck.length > 0
}

function doDraw() {
  if (!canDraw()) return
  const card = state.deck.shift()
  state.order.cards.push(card)
  if (state.deck.length === 0) state.finalRoundActive = true
  pushLog('draw', {
    playerName: turnPlayer.value.name,
    defId: card.defId,
    cardType: card.type,
    price: instancePrice(card),
  })
}

function canShip() {
  return state.phase === 'playing' && windowStatus.value === 'within'
}

function doShip() {
  if (!canShip()) return
  const player = turnPlayer.value
  const categoryCount = collectedCategories.value.size
  const vpGained = scoreForCategoryCount(categoryCount)
  for (const card of state.order.cards) {
    if (card.type === 'product') {
      player.productsWon.push(card.defId)
    } else {
      player.specialInventory.push({ instanceId: card.instanceId, defId: card.defId })
    }
  }
  player.vp += vpGained
  const total = effectiveTotal.value
  state.windowLevel = advanceLevel(state.windowLevel)
  pushLog('ship', { playerName: player.name, vp: vpGained, categoryCount, total })
  pushLog('window-move', { level: state.windowLevel })
  nextTurn()
}

function canStopOrFail() {
  return state.phase === 'playing' && windowStatus.value !== 'within'
}

function doFail() {
  if (!canStopOrFail()) return
  const total = effectiveTotal.value
  const lostVp = potentialVp.value
  for (const card of state.order.cards) state.discard.push(card)
  state.windowLevel = retreatLevel(state.windowLevel)
  pushLog('fail', { playerName: turnPlayer.value.name, total, lostVp })
  pushLog('window-move', { level: state.windowLevel })
  nextTurn()
}

// A player stuck with an empty cart once the deck is exhausted simply passes —
// no shipment was attempted, so the shared window does not move. (Documented
// assumption: simplest consistent reading of spec section 9.)
function canPassEmptyTurn() {
  return state.phase === 'playing' && state.deck.length === 0 && state.order.cards.length === 0
}

function passEmptyTurn() {
  if (!canPassEmptyTurn()) return
  pushLog('turn-skip', { playerName: turnPlayer.value.name })
  nextTurn()
}

// --- Special cards ---

function heldInstance(playerIndex, instanceId) {
  return state.players[playerIndex]?.specialInventory.find((s) => s.instanceId === instanceId)
}

function consumeSpecial(playerIndex, instanceId) {
  const player = state.players[playerIndex]
  const idx = player.specialInventory.findIndex((s) => s.instanceId === instanceId)
  if (idx === -1) return null
  const [entry] = player.specialInventory.splice(idx, 1)
  state.discard.push({ instanceId: entry.instanceId, defId: entry.defId, type: 'special' })
  return entry
}

function isActivePlayer(playerIndex) {
  return state.phase === 'playing' && playerIndex === state.turnIndex
}

function canUseCoupon(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId)
}

function useCoupon(playerIndex, instanceId) {
  if (!canUseCoupon(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.couponCount++
  pushLog('coupon', { playerName: state.players[playerIndex].name })
}

function canUseFreeReturn(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId) && !!freeReturnTarget.value
}

function useFreeReturn(playerIndex, instanceId) {
  if (!canUseFreeReturn(playerIndex, instanceId)) return
  const target = freeReturnTarget.value
  consumeSpecial(playerIndex, instanceId)
  const idx = state.order.cards.findIndex((c) => c.instanceId === target.instanceId)
  if (idx !== -1) {
    const [removed] = state.order.cards.splice(idx, 1)
    state.discard.push(removed)
  }
  pushLog('free-return', { playerName: state.players[playerIndex].name, defId: target.defId })
}

function canUseTaxInsurance(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId)
}

function useTaxInsurance(playerIndex, instanceId) {
  if (!canUseTaxInsurance(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.taxInsuranceCount++
  pushLog('tax-insurance', { playerName: state.players[playerIndex].name })
}

function flashSaleEligibleTargets() {
  return state.order.cards.filter((c) => c.type === 'product')
}

function canUseFlashSale(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId)
}

function useFlashSale(playerIndex, instanceId, targetInstanceIds) {
  if (!canUseFlashSale(playerIndex, instanceId)) return
  const eligible = new Set(flashSaleEligibleTargets().map((c) => c.instanceId))
  const targets = [...new Set(targetInstanceIds)].filter((id) => eligible.has(id)).slice(0, 2)
  consumeSpecial(playerIndex, instanceId)
  for (const id of targets) {
    state.turnEffects.flashSaleDiscounts[id] = (state.turnEffects.flashSaleDiscounts[id] ?? 0) + 2
  }
  pushLog('flash-sale', { playerName: state.players[playerIndex].name, count: targets.length })
}

function canUseSneakPeek(playerIndex, instanceId) {
  return (
    isActivePlayer(playerIndex) &&
    !!heldInstance(playerIndex, instanceId) &&
    !state.turnEffects.sneakPeekInstanceId &&
    windowStatus.value !== 'above' &&
    state.deck.length > 0
  )
}

function useSneakPeek(playerIndex, instanceId) {
  if (!canUseSneakPeek(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.sneakPeekInstanceId = state.deck[0].instanceId
  pushLog('sneak-peek', { playerName: state.players[playerIndex].name })
}

function resolveSneakPeek(playerIndex, accept) {
  if (!isActivePlayer(playerIndex) || !state.turnEffects.sneakPeekInstanceId) return
  const player = state.players[playerIndex]
  if (accept) {
    state.turnEffects.sneakPeekInstanceId = null
    pushLog('sneak-peek-draw', { playerName: player.name })
    doDraw()
  } else {
    state.turnEffects.sneakPeekInstanceId = null
    pushLog('sneak-peek-decline', { playerName: player.name })
  }
}

export function useGameState() {
  return {
    state,
    turnPlayer,
    currentWindow,
    minLimit,
    maxLimit,
    effectiveTotal,
    windowStatus,
    effectivePriceOf,
    collectedCategories,
    potentialVp,
    freeReturnTarget,
    flashSaleEligibleTargets,
    peekedCard,
    startGame,
    resetGame,
    canDraw,
    doDraw,
    canShip,
    doShip,
    canStopOrFail,
    doFail,
    canPassEmptyTurn,
    passEmptyTurn,
    canUseCoupon,
    useCoupon,
    canUseFreeReturn,
    useFreeReturn,
    canUseTaxInsurance,
    useTaxInsurance,
    canUseFlashSale,
    useFlashSale,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
  }
}

export { SPECIALS_BY_ID }
