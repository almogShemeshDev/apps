import { watch } from 'vue'
import { useGameState } from './useGameState.js'
import { isLegalPlay, diceTotal } from './useTrickLogic.js'

const DELAY = 900

export function useBotAI() {
  const { state, playCard, pickDie, passPicking } = useGameState()

  watch(
    () => state.phase === 'playing' && state.currentPlayerIndex,
    () => {
      if (state.phase === 'playing' && state.players[state.currentPlayerIndex]?.isBot) {
        setTimeout(doPlay, DELAY)
      }
    }
  )

  watch(
    () => [state.phase, state.dicePickingTurn],
    () => {
      if (state.phase !== 'dice-picking') return
      const pickerIndex = state.trickResult?.losers?.[state.dicePickingTurn]
      if (pickerIndex !== undefined && state.players[pickerIndex]?.isBot) {
        setTimeout(doPick, DELAY)
      }
    }
  )

  function doPlay() {
    if (state.phase !== 'playing') return
    const pi = state.currentPlayerIndex
    const player = state.players[pi]
    if (!player?.isBot) return

    const hand = player.hand
    const leadSuit = state.leadSuit
    const legal = hand.filter(c => isLegalPlay(c, hand, leadSuit))
    if (!legal.length) return

    // Prefer lead-suit cards; among those pick the first (arbitrary)
    const leadCards = legal.filter(c => c.suit === leadSuit)
    const card = leadCards.length
      ? leadCards[Math.floor(Math.random() * leadCards.length)]
      : legal[Math.floor(Math.random() * legal.length)]

    const diceIds = card.suit === leadSuit ? selectDice(player) : []

    playCard(card, diceIds)
  }

  function selectDice(player) {
    const myDice = [...player.dice].sort((a, b) => b.value - a.value)
    if (!myDice.length) return []

    // What's the best lead-suit total already committed this trick?
    const leadPlays = state.trick.filter(e => e.card.suit === state.leadSuit)
    const currentBest = leadPlays.length
      ? Math.max(...leadPlays.map(e => diceTotal(e.dice)))
      : -1

    // Round-scaled dice budget: Round 1 → 1 die, Round 8 → all dice.
    // Applies whether the bot is leading or chasing an existing total, so bots
    // don't blow most of their dice fighting over an early trick.
    const budget = Math.max(1, Math.round((state.round / 8) * myDice.length))

    if (currentBest >= 0) {
      // Respond to an existing target: find the fewest dice that exceed it
      let sum = 0
      const chosen = []
      for (const die of myDice) {
        chosen.push(die)
        sum += die.value
        if (sum > currentBest) {
          // Fold if beating it would cost more dice than this round's budget allows
          return chosen.length <= budget ? chosen.map(d => d.id) : []
        }
      }
      // Can't beat the target even with all dice — save them
      return []
    }

    // Bot is first to set a lead-suit total: scale aggression with round
    return myDice.slice(0, budget).map(d => d.id)
  }

  function doPick() {
    if (state.phase !== 'dice-picking') return
    if (!state.dicePool.length) {
      passPicking()
      return
    }
    const pickerIndex = state.trickResult?.losers?.[state.dicePickingTurn]
    if (pickerIndex === undefined || !state.players[pickerIndex]?.isBot) return

    // Pick the highest-value die available
    const best = state.dicePool.reduce((a, b) => b.value > a.value ? b : a)
    pickDie(best.id)
  }
}
