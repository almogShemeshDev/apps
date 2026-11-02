import { ref, watch } from 'vue'
import { useGameState } from './useGameState.js'
import { probBust, probOverflow, instancePrice, instancePoints } from '../game/probability.js'
import { categoryCounts, scoreForCategoryProductCount } from '../game/scoring.js'
import { PRODUCTS_BY_ID } from '../game/products.js'

const DELAY = 650
const BUST_RISK_THRESHOLD = 0.3
const OVERFLOW_RISK_THRESHOLD = 0.45

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useBotAI() {
  const {
    state,
    effectiveTotal,
    maxLimit,
    minLimit,
    effectiveProblemPoints,
    productCardsInOrder,
    stopKeepCount,
    needsKeepSelection,
    canDraw,
    doDraw,
    canStop,
    doStop,
    canPassEmptyTurn,
    passEmptyTurn,
    canUseCoupon,
    useCoupon,
    canUseShippingInsurance,
    useShippingInsurance,
    canUseExtraPick,
    useExtraPick,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
    peekedCards,
  } = useGameState()

  const botBusy = ref(false)

  watch(
    () => [state.phase, state.turnNumber, state.turnIndex],
    () => maybeAct(),
    { immediate: true }
  )

  function maybeAct() {
    if (botBusy.value) return
    if (state.phase !== 'playing') return
    const pi = state.turnIndex
    if (state.players[pi]?.isBot) runBotTurn(pi)
  }

  // Each bot turn loops: resolve any pending peek, use helpful bonus cards,
  // then decide whether another draw's reward is worth the added bust/fee risk.
  async function runBotTurn(playerIndex) {
    botBusy.value = true

    for (let guard = 0; guard < 60; guard++) {
      await sleep(DELAY)

      if (peekedCards.value) {
        resolveSneakPeek(playerIndex, decideSneakPeekSwap())
        continue
      }

      if (canPassEmptyTurn()) {
        passEmptyTurn()
        break
      }

      const bonus = chooseBonusToPlay(playerIndex)
      if (bonus) {
        bonus.perform()
        continue
      }

      if (shouldKeepDrawing(playerIndex) && canDraw()) {
        doDraw()
        continue
      }

      if (canStop()) {
        doStop(needsKeepSelection.value ? chooseProductsToKeep(playerIndex) : undefined)
      }
      break
    }

    botBusy.value = false
  }

  // Peek already happened; decide whether to swap the top two deck cards so
  // the friendlier one is drawn first.
  function decideSneakPeekSwap() {
    const ids = peekedCards.value
    if (!ids || ids.length < 2) return false
    const cards = ids.map((id) => state.deck.find((c) => c.instanceId === id)).filter(Boolean)
    if (cards.length < 2) return false
    return riskOf(cards[1]) < riskOf(cards[0])
  }

  function riskOf(card) {
    if (card.type === 'problem') return 100 + instancePoints(card)
    return instancePrice(card)
  }

  // Keep drawing while the odds of busting stay low, and while there is
  // still room below the free-shipping ceiling to make the draw worthwhile.
  function shouldKeepDrawing(playerIndex) {
    const bustRisk = probBust(state.deck, effectiveProblemPoints.value)
    if (bustRisk >= BUST_RISK_THRESHOLD) return false
    if (effectiveTotal.value < minLimit.value) return true
    const overflowRisk = probOverflow(state.deck, effectiveTotal.value, maxLimit.value)
    return overflowRisk < OVERFLOW_RISK_THRESHOLD
  }

  // Try the bonus cards that help right now, preferring the one with the
  // biggest immediate benefit.
  function chooseBonusToPlay(playerIndex) {
    const player = state.players[playerIndex]
    const candidates = []

    for (const entry of player.specialInventory) {
      if (entry.defId === 'S03' && canUseShippingInsurance(playerIndex, entry.instanceId)) {
        const bustRisk = probBust(state.deck, effectiveProblemPoints.value)
        if (effectiveProblemPoints.value > 0 && bustRisk >= BUST_RISK_THRESHOLD) {
          candidates.push({
            gain: Math.min(2, effectiveProblemPoints.value),
            perform: () => useShippingInsurance(playerIndex, entry.instanceId),
          })
        }
      }
      if (entry.defId === 'S01' && canUseCoupon(playerIndex, entry.instanceId)) {
        if (effectiveTotal.value > maxLimit.value) {
          candidates.push({ gain: 5, perform: () => useCoupon(playerIndex, entry.instanceId) })
        }
      }
      if (entry.defId === 'S04' && canUseExtraPick(playerIndex, entry.instanceId)) {
        if (productCardsInOrder.value.length > stopKeepCount.value) {
          candidates.push({ gain: 4, perform: () => useExtraPick(playerIndex, entry.instanceId) })
        }
      }
    }

    if (!candidates.length) return null
    candidates.sort((a, b) => b.gain - a.gain)
    return candidates[0]
  }

  // When more products were drawn than can be kept, prefer the ones that add
  // the most endgame score — new categories and categories close to a tier.
  function chooseProductsToKeep(playerIndex) {
    const player = state.players[playerIndex]
    const runningCounts = categoryCounts(player.productsWon)
    const keepCount = stopKeepCount.value
    const remaining = [...productCardsInOrder.value]
    const chosen = []

    while (chosen.length < keepCount && remaining.length) {
      remaining.sort((a, b) => marginalValue(b, runningCounts) - marginalValue(a, runningCounts))
      const [best] = remaining.splice(0, 1)
      chosen.push(best.instanceId)
      const category = PRODUCTS_BY_ID[best.defId]?.category
      if (category) runningCounts[category] = (runningCounts[category] ?? 0) + 1
    }
    return chosen
  }

  function marginalValue(card, counts) {
    const category = PRODUCTS_BY_ID[card.defId]?.category
    if (!category) return 0
    const current = counts[category] ?? 0
    return scoreForCategoryProductCount(current + 1) - scoreForCategoryProductCount(current)
  }
}
