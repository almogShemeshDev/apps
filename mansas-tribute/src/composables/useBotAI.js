import { watch } from 'vue'
import { useGameState } from './useGameState.js'
import { isLegalPlay } from './useTrickLogic.js'

const DELAY = 900

export function useBotAI() {
  const { state, playCard, pickDie, passPicking } = useGameState()

  watch(
    () => ({
      phase: state.phase,
      currentPlayerIndex: state.currentPlayerIndex,
      dicePickingTurn: state.dicePickingTurn,
    }),
    ({ phase }) => {
      if (phase === 'playing' && state.players[state.currentPlayerIndex]?.isBot) {
        setTimeout(doPlay, DELAY)
      }
      if (phase === 'dice-picking') {
        const pickerIndex = state.trickResult?.losers?.[state.dicePickingTurn]
        if (pickerIndex !== undefined && state.players[pickerIndex]?.isBot) {
          setTimeout(doPick, DELAY)
        }
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

    // Following lead suit: attach all dice to maximise winning chance
    // Not following: no dice (can't win the primary contest; save dice)
    const diceIds = card.suit === leadSuit ? player.dice.map(d => d.id) : []

    playCard(card, diceIds)
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
