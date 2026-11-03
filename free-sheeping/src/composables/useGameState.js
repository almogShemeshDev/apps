import { reactive, computed } from 'vue'
import { buildDeck } from '../game/deck.js'
import { belowMinPenaltyFor, SHIPPING_WINDOW } from '../game/windows.js'
import { SPECIALS_BY_ID } from '../game/specials.js'
import { instancePrice, instancePoints, taxCardCount } from '../game/probability.js'
import { baseKeepTier } from '../game/keepTiers.js'

let nextLogId = 1

function freshTurnEffects() {
  return { couponCount: 0, insuranceCancelCount: 0, extraPickCount: 0, sneakPeekCards: null }
}

const state = reactive({
  phase: 'setup', // 'setup' | 'playing' | 'game-over'
  players: [], // { name, isBot, productsWon: [defId,...], specialInventory: [{instanceId, defId}], shippingPenalty } — score is derived from productsWon (see scoring.js) minus shippingPenalty

  deck: [], // array of card instances, index 0 = top of deck
  discard: [],
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

const rawTotal = computed(() => state.order.cards.reduce((sum, c) => sum + instancePrice(c), 0))
const effectiveTotal = computed(() => Math.max(0, rawTotal.value - state.turnEffects.couponCount * 5))
const minLimit = computed(() => SHIPPING_WINDOW.min)
const maxLimit = computed(() => SHIPPING_WINDOW.max)
const windowStatus = computed(() => {
  if (effectiveTotal.value < minLimit.value) return 'below'
  if (effectiveTotal.value > maxLimit.value) return 'above'
  return 'within'
})

const rawProblemPoints = computed(() =>
  state.order.cards.filter((c) => c.type === 'problem').reduce((sum, c) => sum + instancePoints(c), 0)
)
const effectiveProblemPoints = computed(() =>
  Math.max(0, rawProblemPoints.value - state.turnEffects.insuranceCancelCount * 2)
)

const productCardsInOrder = computed(() => state.order.cards.filter((c) => c.type === 'product'))

// baseKeepTier (see keepTiers.js) plus any Extra Pick bonuses used this turn.
const stopKeepCount = computed(() => baseKeepTier(productCardsInOrder.value.length) + state.turnEffects.extraPickCount)

const needsKeepSelection = computed(() => productCardsInOrder.value.length > stopKeepCount.value)

const peekedCards = computed(() => state.turnEffects.sneakPeekCards)

// What stopping right now would cost: a flat fee for finishing below the
// minimum, plus -1 VP for every positive-price card taxed for exceeding the
// max (see taxCardCount). Shown live in the cart; recomputed for real at
// doStop() once the final cart and bonuses are known.
const projectedPenalty = computed(
  () =>
    belowMinPenaltyFor(effectiveTotal.value) +
    taxCardCount(state.order.cards, state.turnEffects.couponCount, maxLimit.value)
)

function createPlayer(input) {
  const name = typeof input === 'string' ? input : input.name
  const isBot = typeof input === 'string' ? false : !!input.isBot
  return { name, isBot, productsWon: [], specialInventory: [], shippingPenalty: 0 }
}

function startGame(playerInputs) {
  state.players = playerInputs.map(createPlayer)
  state.deck = buildDeck(playerInputs.length)
  state.discard = []
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

// --- Draw / Stop / Bust ---

function canDraw() {
  return state.phase === 'playing' && !state.turnEffects.sneakPeekCards && state.deck.length > 0
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
  if (card.type === 'problem' && effectiveProblemPoints.value >= 3) {
    doBust()
  }
}

function doBust() {
  const player = turnPlayer.value
  const points = rawProblemPoints.value
  for (const card of state.order.cards) state.discard.push(card)
  pushLog('bust', { playerName: player.name, points })
  nextTurn()
}

function canStop() {
  return state.phase === 'playing' && !state.turnEffects.sneakPeekCards && state.order.cards.length > 0
}

// If productCardsInOrder exceeds the keep allowance, the caller (UI or bot)
// must pass the instanceIds of the products to keep; otherwise all are kept.
function doStop(selectedInstanceIds) {
  if (!canStop()) return
  const player = turnPlayer.value
  const total = effectiveTotal.value
  const keepCount = stopKeepCount.value
  const products = productCardsInOrder.value

  let keepIds
  if (products.length <= keepCount) {
    keepIds = new Set(products.map((c) => c.instanceId))
  } else {
    keepIds = new Set(selectedInstanceIds ?? [])
  }

  let keptCount = 0
  for (const card of state.order.cards) {
    if (card.type === 'product') {
      if (keepIds.has(card.instanceId) && keptCount < keepCount) {
        player.productsWon.push(card.defId)
        keptCount++
      } else {
        state.discard.push(card)
      }
    } else if (card.type === 'special') {
      player.specialInventory.push({ instanceId: card.instanceId, defId: card.defId })
    } else {
      state.discard.push(card) // problem cards
    }
  }

  const penalty = belowMinPenaltyFor(total) + taxCardCount(state.order.cards, state.turnEffects.couponCount, maxLimit.value)
  player.shippingPenalty += penalty
  pushLog('stop', { playerName: player.name, productCount: keptCount, total, penalty })
  nextTurn()
}

// A player stuck with an empty cart once the deck is exhausted simply passes —
// no order was attempted.
function canPassEmptyTurn() {
  return state.phase === 'playing' && state.deck.length === 0 && state.order.cards.length === 0
}

function passEmptyTurn() {
  if (!canPassEmptyTurn()) return
  pushLog('turn-skip', { playerName: turnPlayer.value.name })
  nextTurn()
}

// --- Bonus cards ---

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
  return state.phase === 'playing' && playerIndex === state.turnIndex && !state.turnEffects.sneakPeekCards
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
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId) && productCardsInOrder.value.length > 0
}

function useFreeReturn(playerIndex, instanceId, targetInstanceId) {
  if (!canUseFreeReturn(playerIndex, instanceId)) return
  const idx = state.order.cards.findIndex((c) => c.instanceId === targetInstanceId && c.type === 'product')
  if (idx === -1) return
  consumeSpecial(playerIndex, instanceId)
  const [removed] = state.order.cards.splice(idx, 1)
  state.discard.push(removed)
  pushLog('free-return', { playerName: state.players[playerIndex].name, defId: removed.defId })
}

function canUseShippingInsurance(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId)
}

function useShippingInsurance(playerIndex, instanceId) {
  if (!canUseShippingInsurance(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.insuranceCancelCount++
  pushLog('shipping-insurance', { playerName: state.players[playerIndex].name })
}

function canUseExtraPick(playerIndex, instanceId) {
  return isActivePlayer(playerIndex) && !!heldInstance(playerIndex, instanceId)
}

function useExtraPick(playerIndex, instanceId) {
  if (!canUseExtraPick(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.extraPickCount++
  pushLog('extra-pick', { playerName: state.players[playerIndex].name })
}

function canUseSneakPeek(playerIndex, instanceId) {
  return (
    isActivePlayer(playerIndex) &&
    !!heldInstance(playerIndex, instanceId) &&
    !state.turnEffects.sneakPeekCards &&
    state.deck.length > 0
  )
}

function useSneakPeek(playerIndex, instanceId) {
  if (!canUseSneakPeek(playerIndex, instanceId)) return
  consumeSpecial(playerIndex, instanceId)
  state.turnEffects.sneakPeekCards = state.deck.slice(0, 2).map((c) => c.instanceId)
  pushLog('sneak-peek', { playerName: state.players[playerIndex].name })
}

// swap=true puts the deck's 2nd-from-top card on top instead.
function resolveSneakPeek(playerIndex, swap) {
  if (!state.turnEffects.sneakPeekCards) return
  if (!(state.phase === 'playing' && playerIndex === state.turnIndex)) return
  const player = state.players[playerIndex]
  if (swap && state.deck.length >= 2) {
    ;[state.deck[0], state.deck[1]] = [state.deck[1], state.deck[0]]
  }
  state.turnEffects.sneakPeekCards = null
  pushLog(swap ? 'sneak-peek-swap' : 'sneak-peek-keep', { playerName: player.name })
}

export function useGameState() {
  return {
    state,
    turnPlayer,
    minLimit,
    maxLimit,
    effectiveTotal,
    windowStatus,
    rawProblemPoints,
    effectiveProblemPoints,
    productCardsInOrder,
    stopKeepCount,
    needsKeepSelection,
    peekedCards,
    projectedPenalty,
    startGame,
    resetGame,
    canDraw,
    doDraw,
    canStop,
    doStop,
    canPassEmptyTurn,
    passEmptyTurn,
    canUseCoupon,
    useCoupon,
    canUseFreeReturn,
    useFreeReturn,
    canUseShippingInsurance,
    useShippingInsurance,
    canUseExtraPick,
    useExtraPick,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
  }
}

export { SPECIALS_BY_ID }
