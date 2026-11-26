import { ref, watch } from 'vue'
import { useGameState } from './useGameState.js'

const DELAY = 650

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useBotAI() {
  const { state, pickCard } = useGameState()

  const botBusy = ref(false)

  watch(
    () => [state.phase, state.activePlayerIndex, state.round],
    () => maybeAct(),
    { immediate: true }
  )

  async function maybeAct() {
    if (botBusy.value) return
    if (state.phase !== 'playing') return
    const player = state.players[state.activePlayerIndex]
    if (!player?.isBot) return

    botBusy.value = true
    await sleep(DELAY)
    const idx = chooseCardIndex(player)
    if (idx !== null) pickCard(idx)
    botBusy.value = false
  }

  // Shares are worth more the more that company's trains are already on the
  // board (and the more the bot already holds); trains don't directly help
  // whoever drafts them (they always join the shared pool), so a bot only
  // mildly favors trains in companies it's already invested in.
  function scoreCard(player, card) {
    if (card.kind === 'share') {
      return (player.shares[card.company] + 1) * (state.pool[card.company] + 1)
    }
    return player.shares[card.company] * 2 + 0.5
  }

  function chooseCardIndex(player) {
    if (!state.row.length) return null
    let bestIndex = 0
    let bestScore = -Infinity
    state.row.forEach((card, i) => {
      const score = scoreCard(player, card)
      if (score > bestScore) {
        bestScore = score
        bestIndex = i
      }
    })
    return bestIndex
  }
}
