import { ref, watch } from 'vue'
import { useGameState } from './useGameState.js'
import { COLORS } from '../constants.js'

const DELAY = 650

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useBotAI() {
  const {
    state,
    turnPlayerIndex,
    assignPoolCardToGroup,
    canConfirmGroups,
    confirmGroups,
    canPickGroup,
    pickGroup,
    canConfirmPickerTurn,
    confirmPickerTurn,
    canClaimFinalGroup,
    claimFinalGroup,
    canEndRound,
    endRound,
    canTrashThree,
    trashThree,
    canTrashFour,
    trashFour,
    canUseBlueAbility,
    useBlueAbilityDraw,
    blueReturnCandidates,
    resolveBlueReturn,
    canUseRedAbility,
    redAbilityTargets,
    useRedAbility,
    canUseYellowAbility,
    yellowTargetCandidates,
    useYellowAbility,
    canUseGreenAbility,
    useGreenAbility,
    whiteConversionOutcome,
    whiteConversionOptions,
    canUseWhiteConversion,
    useWhiteConversionTrash,
    useWhiteConversionBlue,
    whiteConversionYellowTargets,
    useWhiteConversionYellow,
    whiteConversionRedTargets,
    useWhiteConversionRed,
    canUseWhiteConversionGreen,
    useWhiteConversionGreen,
    countColor,
  } = useGameState()

  const botBusy = ref(false)

  watch(
    () => [state.phase, state.round, turnPlayerIndex.value],
    () => maybeAct(),
    { immediate: true }
  )

  function maybeAct() {
    if (botBusy.value) return
    if (state.phase === 'dealing' && state.players[state.dealerIndex]?.isBot) {
      runBotDealing()
      return
    }
    if (state.phase === 'picking' || state.phase === 'dealer-final') {
      const pi = turnPlayerIndex.value
      if (pi >= 0 && state.players[pi]?.isBot) runBotTurn(pi)
    }
  }

  // --- Dealing: split the pool evenly across groups, 2-per-group by construction ---
  async function runBotDealing() {
    botBusy.value = true
    await sleep(DELAY)
    const cardIds = state.pool.map((c) => c.id)
    const groupIds = state.groups.map((g) => g.id)
    cardIds.forEach((cardId, idx) => {
      assignPoolCardToGroup(cardId, groupIds[idx % groupIds.length])
    })
    await sleep(DELAY)
    if (canConfirmGroups()) confirmGroups()
    botBusy.value = false
  }

  // --- Picking / dealer-final: take a group (or the leftover), spend abilities, then pass the turn ---
  async function runBotTurn(playerIndex) {
    botBusy.value = true

    if (state.phase === 'picking' && !state.pickerHasPicked) {
      await sleep(DELAY)
      const groupId = chooseGroupToPick(playerIndex)
      if (groupId != null) pickGroup(playerIndex, groupId)
    } else if (state.phase === 'dealer-final' && canClaimFinalGroup(playerIndex)) {
      await sleep(DELAY)
      claimFinalGroup(playerIndex)
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (state.pendingBlueReturn && state.pendingBlueReturn.playerIndex === playerIndex) {
        await sleep(DELAY)
        doBlueReturn(playerIndex)
        continue
      }
      const action = chooseBestAbility(playerIndex)
      if (!action) break
      await sleep(DELAY)
      action.perform()
    }

    await sleep(DELAY)
    if (state.phase === 'picking' && canConfirmPickerTurn(playerIndex)) {
      confirmPickerTurn(playerIndex)
    } else if (state.phase === 'dealer-final' && canEndRound(playerIndex)) {
      endRound()
    }

    botBusy.value = false
  }

  // Score a group by how well its cards build toward usable same-color stacks
  // (3-of-a-kind unlocks the generic discard, 4-of-a-kind unlocks a colored ability).
  function chooseGroupToPick(playerIndex) {
    const hand = state.players[playerIndex].hand
    const candidates = state.groups.filter((g) => canPickGroup(playerIndex, g.id))
    if (!candidates.length) return null

    let best = null
    let bestScore = -Infinity
    for (const group of candidates) {
      const counts = {}
      for (const color of COLORS) counts[color] = countColor(hand, color)
      let score = 0
      for (const card of group.cards) {
        counts[card.color] += 1
        const n = counts[card.color]
        if (n === 3) score += 3
        else if (n === 4) score += 6
        else if (n > 4) score += 1
        else score += 1
      }
      score += Math.random() * 0.01
      if (score > bestScore) {
        bestScore = score
        best = group
      }
    }
    return best?.id ?? null
  }

  function doBlueReturn(playerIndex) {
    const hand = state.players[playerIndex].hand
    const candidates = blueReturnCandidates(playerIndex)
    if (!candidates.length) return
    const color = candidates.reduce(
      (worst, c) => (countColor(hand, c) < countColor(hand, worst) ? c : worst),
      candidates[0]
    )
    resolveBlueReturn(playerIndex, color)
  }

  // Each ability's "net" is roughly how many cards it removes from the hand overall;
  // the bot always takes the highest-value action available on its turn.
  function chooseBestAbility(playerIndex) {
    const hand = state.players[playerIndex].hand
    const candidates = []

    for (const color of COLORS) {
      if (canTrashThree(playerIndex, color)) {
        candidates.push({ net: 3, perform: () => trashThree(playerIndex, color) })
      }
      if (canTrashFour(playerIndex, color)) {
        candidates.push({ net: 4, perform: () => trashFour(playerIndex, color) })
      }
    }

    if (canUseBlueAbility(playerIndex)) {
      candidates.push({ net: 4, perform: () => useBlueAbilityDraw(playerIndex) })
    }

    if (canUseRedAbility(playerIndex)) {
      const targets = redAbilityTargets(playerIndex)
      if (targets.length) {
        const color = targets.reduce(
          (best, c) => (countColor(hand, c) > countColor(hand, best) ? c : best),
          targets[0]
        )
        candidates.push({ net: 5, perform: () => useRedAbility(playerIndex, color) })
      }
    }

    if (canUseYellowAbility(playerIndex)) {
      const targets = yellowTargetCandidates(playerIndex)
      if (targets.length) {
        const color = targets[0]
        candidates.push({ net: 4 + countColor(hand, color), perform: () => useYellowAbility(playerIndex, color) })
      }
    }

    if (canUseGreenAbility(playerIndex)) {
      candidates.push({ net: 3, perform: () => performGreenAbility(playerIndex) })
    }

    if (canUseWhiteConversion(playerIndex)) {
      for (const color of whiteConversionOptions(playerIndex)) {
        const candidate = evaluateWhiteConversion(playerIndex, color)
        if (candidate) candidates.push(candidate)
      }
    }

    // Flip variants (2 of a color instead of 4) are only worth considering when the
    // bot can't afford the full ability — paying with a flip is VP-neutral (the 2
    // cards leave the hand but cost 2 VP at game end), so only the ability's own
    // effect matters here, not the activation cost.
    if (!canUseBlueAbility(playerIndex) && canUseBlueAbility(playerIndex, true)) {
      candidates.push({ net: 1, perform: () => useBlueAbilityDraw(playerIndex, true) })
    }

    if (!canUseRedAbility(playerIndex) && canUseRedAbility(playerIndex, true)) {
      const targets = redAbilityTargets(playerIndex, true)
      if (targets.length) {
        const color = targets.reduce(
          (best, c) => (countColor(hand, c) > countColor(hand, best) ? c : best),
          targets[0]
        )
        candidates.push({ net: 2, perform: () => useRedAbility(playerIndex, color, true) })
      }
    }

    if (!canUseYellowAbility(playerIndex) && canUseYellowAbility(playerIndex, true)) {
      const targets = yellowTargetCandidates(playerIndex, true)
      if (targets.length) {
        const color = targets[0]
        candidates.push({ net: countColor(hand, color), perform: () => useYellowAbility(playerIndex, color, true) })
      }
    }

    if (!candidates.length) return null
    candidates.sort((a, b) => b.net - a.net)
    return candidates[0]
  }

  // White's conversion spends 2 white + the real cards of `color` needed to reach
  // a merged total of 2/3/4; "base" approximates the resulting VP gain (cards
  // leaving the hand, net of the flip penalty when the outcome is a flip).
  function evaluateWhiteConversion(playerIndex, color) {
    const hand = state.players[playerIndex].hand
    const outcome = whiteConversionOutcome(playerIndex, color)
    if (!outcome) return null

    if (outcome === 'trash') {
      return { net: 4, perform: () => useWhiteConversionTrash(playerIndex, color) }
    }

    const realNeeded = outcome === 'flip' ? 1 : 3
    const base = 2 + realNeeded - (outcome === 'flip' ? 2 : 0)

    if (color === 'blue') {
      if (!state.deck.length) return null
      return { net: base, perform: () => useWhiteConversionBlue(playerIndex) }
    }

    if (color === 'yellow') {
      const targets = whiteConversionYellowTargets(playerIndex)
      if (!targets.length) return null
      const pick = targets[0]
      return { net: base + countColor(hand, pick), perform: () => useWhiteConversionYellow(playerIndex, pick) }
    }

    if (color === 'red') {
      const targets = whiteConversionRedTargets(playerIndex)
      if (!targets.length) return null
      const pick = targets.reduce(
        (best, c) => (countColor(hand, c) > countColor(hand, best) ? c : best),
        targets[0]
      )
      return { net: base + 1, perform: () => useWhiteConversionRed(playerIndex, pick) }
    }

    if (color === 'green') {
      // The flip-outcome steals a card into the hand for a net-zero/negative
      // immediate swing (same caveat as a plain green flip) — skip it, but the
      // 4-total outcome is still a clear net win.
      if (outcome === 'flip' || !canUseWhiteConversionGreen(playerIndex)) return null
      let best = null
      let bestScore = -Infinity
      for (const group of state.groups) {
        for (const card of group.cards) {
          const n = countColor(hand, card.color) + 1
          const score = n === 3 ? 3 : n === 4 ? 6 : 1
          if (score > bestScore) {
            bestScore = score
            best = { groupId: group.id, cardId: card.id }
          }
        }
      }
      if (!best) return null
      return { net: base - 1, perform: () => useWhiteConversionGreen(playerIndex, best.groupId, best.cardId) }
    }

    return null
  }

  function performGreenAbility(playerIndex) {
    const hand = state.players[playerIndex].hand
    let best = null
    let bestScore = -Infinity
    for (const group of state.groups) {
      for (const card of group.cards) {
        const n = countColor(hand, card.color) + 1
        const score = n === 3 ? 3 : n === 4 ? 6 : 1
        if (score > bestScore) {
          bestScore = score
          best = { groupId: group.id, cardId: card.id }
        }
      }
    }
    if (best) useGreenAbility(playerIndex, best.groupId, best.cardId)
  }
}
