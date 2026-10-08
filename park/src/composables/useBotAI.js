import { ref, watch } from 'vue'
import { useGameState } from './useGameState.js'
import { CARD_DEFS, EXIT_CARD_DEFS, getCardOptions } from '../constants.js'

const DELAY = 650

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useBotAI() {
  const {
    state,
    activePlayer,
    toggleDiscSelection,
    activateOption,
    canBuyCard,
    buyCard,
    buyExitCard,
    endTurn,
  } = useGameState()

  const botBusy = ref(false)

  watch(
    () => [state.phase, state.activePlayerIndex, state.round],
    () => maybeAct(),
    { immediate: true }
  )

  function maybeAct() {
    if (botBusy.value) return
    if (state.phase !== 'playing') return
    if (!activePlayer.value?.isBot) return
    runBotTurn()
  }

  async function runBotTurn() {
    botBusy.value = true

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const player = activePlayer.value
      if (!player) break

      if (state.pendingChoice) {
        await sleep(DELAY)
        if (!resolvePendingChoiceBot(player)) break
        continue
      }

      const action = chooseBestAction(player)
      if (!action) break
      await sleep(DELAY)
      action.perform()
    }

    await sleep(DELAY)
    endTurn()
    botBusy.value = false
  }

  // Discs the player would rather lose first when forced to discard/trash:
  // grey and money are the least useful resources to hold onto.
  const DISPOSE_PRIORITY = ['grey', 'money', 'visitor', 'worker', 'gardener', 'pink']

  function resolvePendingChoiceBot(player) {
    const pc = state.pendingChoice
    let idx = -1
    if (pc.filter) {
      idx = player.drawn.findIndex((d) => d === pc.filter)
    } else {
      for (const type of DISPOSE_PRIORITY) {
        idx = player.drawn.findIndex((d) => d === type)
        if (idx !== -1) break
      }
    }
    if (idx === -1) return false
    toggleDiscSelection(idx)
    return true
  }

  function requiredMultiset(option) {
    const map = {}
    for (const d of option.use.discs) map[d.type] = (map[d.type] ?? 0) + d.amount
    return map
  }

  function canAffordOption(player, card, option) {
    const maxUses = option.maxUsesPerTurn ?? 1
    if ((card.usesThisTurn[option.id] ?? 0) >= maxUses) return false
    if (option.use.gold && player.gold < option.use.gold) return false
    return !!selectForMultiset(player, requiredMultiset(option))
  }

  function selectForMultiset(player, multiset) {
    const need = { ...multiset }
    const indices = []
    player.drawn.forEach((disc, idx) => {
      if (need[disc] > 0) {
        indices.push(idx)
        need[disc]--
      }
    })
    const satisfied = Object.values(need).every((n) => n <= 0)
    return satisfied ? indices : null
  }

  function pinkIndices(player, count) {
    const indices = []
    player.drawn.forEach((disc, idx) => {
      if (disc === 'pink' && indices.length < count) indices.push(idx)
    })
    return indices.length === count ? indices : null
  }

  function benefitScore(benefits) {
    let score = 0
    for (const effect of benefits) {
      if (effect.type === 'vp') score += effect.amount * 5
      else if (effect.type === 'gainDisc') score += effect.amount * (effect.disc === 'pink' ? 3 : 1)
      else if (effect.type === 'gold') score += effect.amount
      else if (effect.type === 'drawDiscs') score += effect.amount
      else if (effect.type === 'trashDiscs') score += effect.amount * 2
    }
    return score
  }

  function chooseBestAction(player) {
    const candidates = []

    for (const cardId of Object.keys(EXIT_CARD_DEFS)) {
      const def = EXIT_CARD_DEFS[cardId]
      if ((state.exitMarket[cardId] ?? 0) <= 0) continue
      const indices = pinkIndices(player, def.pinkCost)
      if (!indices) continue
      candidates.push({
        score: 100 + def.vp,
        perform: () => {
          for (const idx of indices) toggleDiscSelection(idx)
          buyExitCard(cardId)
        },
      })
    }

    for (const card of player.tableau) {
      for (const option of getCardOptions(CARD_DEFS[card.cardId])) {
        if (!canAffordOption(player, card, option)) continue
        const indices = selectForMultiset(player, requiredMultiset(option))
        candidates.push({
          score: 10 + benefitScore(option.benefits),
          perform: () => {
            for (const idx of indices) toggleDiscSelection(idx)
            activateOption(card.uid, option.id)
          },
        })
      }
    }

    for (const cardId of Object.keys(state.market)) {
      if (!canBuyCard(cardId)) continue
      candidates.push({ score: 5 + CARD_DEFS[cardId].cost, perform: () => buyCard(cardId) })
    }

    if (!candidates.length) return null
    candidates.sort((a, b) => b.score - a.score)
    return candidates[0]
  }
}
