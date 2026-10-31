import { ref, watch } from 'vue'
import { useGameState } from './useGameState.js'
import { probOverflow, expectedNextVpGain, instancePrice } from '../game/probability.js'

const DELAY = 650
const OVERFLOW_RISK_THRESHOLD = 0.45

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useBotAI() {
  const {
    state,
    windowStatus,
    effectiveTotal,
    maxLimit,
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
    flashSaleEligibleTargets,
    canUseSneakPeek,
    useSneakPeek,
    resolveSneakPeek,
    peekedCard,
    collectedCategories,
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

  // Each bot turn is a small decision loop: rescue if over the limit, draw while
  // the risk/reward looks good, otherwise ship or accept failure.
  async function runBotTurn(playerIndex) {
    botBusy.value = true

    for (let guard = 0; guard < 60; guard++) {
      await sleep(DELAY)

      if (state.turnEffects.sneakPeekInstanceId) {
        resolveSneakPeek(playerIndex, decideSneakPeek(playerIndex))
        continue
      }

      if (canPassEmptyTurn()) {
        passEmptyTurn()
        break
      }

      const status = windowStatus.value

      if (status === 'above') {
        const rescue = chooseRescue(playerIndex)
        if (rescue) {
          rescue.perform()
          continue
        }
        if (canShip()) {
          doShip()
        } else if (canStopOrFail()) {
          doFail()
        }
        break
      }

      if (status === 'within') {
        if (shouldKeepDrawing(playerIndex) && canDraw()) {
          doDraw()
          continue
        }
        if (canShip()) doShip()
        break
      }

      // status === 'below'
      if (canUseSneakPeek(playerIndex, heldSneakPeekId(playerIndex))) {
        useSneakPeek(playerIndex, heldSneakPeekId(playerIndex))
        continue
      }
      if (canDraw()) {
        doDraw()
        continue
      }
      if (canStopOrFail()) doFail()
      break
    }

    botBusy.value = false
  }

  function heldSneakPeekId(playerIndex) {
    const entry = state.players[playerIndex].specialInventory.find((s) => s.defId === 'S05')
    return entry?.instanceId
  }

  function decideSneakPeek() {
    // Peek already happened; decide whether the revealed card keeps us in a good spot.
    const card = peekedCard.value
    if (!card) return false
    const nextTotal = effectiveTotal.value + instancePrice(card)
    return nextTotal <= maxLimit.value
  }

  function shouldKeepDrawing(playerIndex) {
    const risk = probOverflow(state.deck, effectiveTotal.value, maxLimit.value)
    const expVpGain = expectedNextVpGain(state.deck, collectedCategories.value)
    if (risk >= OVERFLOW_RISK_THRESHOLD) return false
    return expVpGain > 0.5
  }

  // Try the specials that can bring an over-the-limit order back into range,
  // preferring the one that helps the most.
  function chooseRescue(playerIndex) {
    const player = state.players[playerIndex]
    const candidates = []

    for (const entry of player.specialInventory) {
      if (entry.defId === 'S01' && canUseCoupon(playerIndex, entry.instanceId)) {
        candidates.push({ gain: 3, perform: () => useCoupon(playerIndex, entry.instanceId) })
      }
      if (entry.defId === 'S03' && canUseTaxInsurance(playerIndex, entry.instanceId)) {
        candidates.push({ gain: 5, perform: () => useTaxInsurance(playerIndex, entry.instanceId) })
      }
      if (entry.defId === 'S04' && canUseFlashSale(playerIndex, entry.instanceId)) {
        const targets = flashSaleEligibleTargets()
          .slice(0, 2)
          .map((c) => c.instanceId)
        if (targets.length) {
          candidates.push({
            gain: targets.length * 2,
            perform: () => useFlashSale(playerIndex, entry.instanceId, targets),
          })
        }
      }
      if (entry.defId === 'S02' && canUseFreeReturn(playerIndex, entry.instanceId)) {
        candidates.push({ gain: 1, perform: () => useFreeReturn(playerIndex, entry.instanceId) })
      }
    }

    if (!candidates.length) return null
    candidates.sort((a, b) => b.gain - a.gain)
    return candidates[0]
  }
}
