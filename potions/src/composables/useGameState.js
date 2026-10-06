import { reactive, computed } from 'vue'
import { COLORS, setupDeck } from '../constants.js'

let nextCardUid = 1

const state = reactive({
  phase: 'setup', // 'setup' | 'dealing' | 'picking' | 'dealer-final' | 'game-over'
  players: [], // { name, hand: [color, ...] }
  dealerIndex: 0,
  round: 1,
  totalRounds: 0,
  cardsPerRound: 0,
  deck: [], // array of colors, index 0 = top of deck
  removedCount: 0,
  discardByColor: {},
  pool: [], // [{ id, color }] dealt cards not yet placed into a group
  groups: [], // [{ id, cards: [{ id, color }] }]
  pickOrder: [], // player indices, clockwise, excluding the dealer
  pickPointer: 0,
  pickerHasPicked: false,
  dealerHasClaimedFinal: false,
  pendingBlueReturn: null, // { playerIndex } while a blue-ability draw awaits its return-to-deck choice
})

const turnPlayerIndex = computed(() => {
  if (state.phase === 'dealing' || state.phase === 'dealer-final') return state.dealerIndex
  if (state.phase === 'picking') return state.pickOrder[state.pickPointer]
  return -1
})

const turnPlayer = computed(() => state.players[turnPlayerIndex.value])

function countColor(hand, color) {
  let n = 0
  for (const c of hand) if (c === color) n++
  return n
}

function removeFromHand(hand, color, n) {
  let left = n
  for (let i = hand.length - 1; i >= 0 && left > 0; i--) {
    if (hand[i] === color) {
      hand.splice(i, 1)
      left--
    }
  }
}

function createPlayer(name) {
  return { name, hand: [] }
}

// The dealer cannot use abilities while splitting the dealt cards into groups —
// only once their own turn comes around after every other player has picked.
function isActionWindow(playerIndex) {
  if (state.pendingBlueReturn) return state.pendingBlueReturn.playerIndex === playerIndex
  if (state.phase === 'dealing') return false
  return turnPlayerIndex.value === playerIndex
}

function startDealingRound() {
  const n = state.players.length
  const dealt = state.deck.splice(0, state.cardsPerRound)
  state.pool = dealt.map((color) => ({ id: nextCardUid++, color }))
  state.groups = Array.from({ length: n }, () => ({ id: nextCardUid++, cards: [] }))
  state.pickOrder = []
  state.pickPointer = 0
  state.pickerHasPicked = false
  state.dealerHasClaimedFinal = false
  state.phase = 'dealing'
}

function startGame(playerNames) {
  const n = playerNames.length
  const { deck, removedCount, cardsPerRound, totalRounds } = setupDeck(n)
  state.players = playerNames.map(createPlayer)
  state.dealerIndex = Math.floor(Math.random() * n)
  state.round = 1
  state.totalRounds = totalRounds
  state.cardsPerRound = cardsPerRound
  state.deck = deck
  state.removedCount = removedCount
  state.discardByColor = Object.fromEntries(COLORS.map((c) => [c, 0]))
  state.pendingBlueReturn = null
  startDealingRound()
}

// --- Dealing phase: dealer distributes the pool into groups ---

function assignPoolCardToGroup(poolCardId, groupId) {
  if (state.phase !== 'dealing') return
  const idx = state.pool.findIndex((c) => c.id === poolCardId)
  const group = state.groups.find((g) => g.id === groupId)
  if (idx === -1 || !group) return
  const [card] = state.pool.splice(idx, 1)
  group.cards.push(card)
}

function returnGroupCardToPool(groupId, cardId) {
  if (state.phase !== 'dealing') return
  const group = state.groups.find((g) => g.id === groupId)
  if (!group) return
  const idx = group.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const [card] = group.cards.splice(idx, 1)
  state.pool.push(card)
}

function moveGroupCardToGroup(fromGroupId, cardId, toGroupId) {
  if (state.phase !== 'dealing' || fromGroupId === toGroupId) return
  const from = state.groups.find((g) => g.id === fromGroupId)
  const to = state.groups.find((g) => g.id === toGroupId)
  if (!from || !to) return
  const idx = from.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const [card] = from.cards.splice(idx, 1)
  to.cards.push(card)
}

function canConfirmGroups() {
  return state.phase === 'dealing' && state.pool.length === 0 && !state.pendingBlueReturn
}

function confirmGroups() {
  if (!canConfirmGroups()) return
  const n = state.players.length
  state.pickOrder = Array.from({ length: n - 1 }, (_, i) => (state.dealerIndex + 1 + i) % n)
  state.pickPointer = 0
  state.pickerHasPicked = false
  state.phase = 'picking'
}

// --- Picking phase: clockwise from the dealer's left, then the dealer takes what's left ---

function canPickGroup(playerIndex, groupId) {
  if (state.phase !== 'picking' || state.pendingBlueReturn) return false
  if (turnPlayerIndex.value !== playerIndex || state.pickerHasPicked) return false
  return state.groups.some((g) => g.id === groupId)
}

function pickGroup(playerIndex, groupId) {
  if (!canPickGroup(playerIndex, groupId)) return
  const idx = state.groups.findIndex((g) => g.id === groupId)
  const [group] = state.groups.splice(idx, 1)
  state.players[playerIndex].hand.push(...group.cards.map((c) => c.color))
  state.pickerHasPicked = true
}

function canConfirmPickerTurn(playerIndex) {
  return (
    state.phase === 'picking' &&
    !state.pendingBlueReturn &&
    turnPlayerIndex.value === playerIndex &&
    state.pickerHasPicked
  )
}

function confirmPickerTurn(playerIndex) {
  if (!canConfirmPickerTurn(playerIndex)) return
  state.pickPointer++
  state.pickerHasPicked = false
  if (state.pickPointer >= state.pickOrder.length) {
    state.phase = 'dealer-final'
    state.dealerHasClaimedFinal = false
  }
}

function canClaimFinalGroup(playerIndex) {
  return (
    state.phase === 'dealer-final' &&
    !state.pendingBlueReturn &&
    playerIndex === state.dealerIndex &&
    !state.dealerHasClaimedFinal &&
    state.groups.length === 1
  )
}

function claimFinalGroup(playerIndex) {
  if (!canClaimFinalGroup(playerIndex)) return
  const [group] = state.groups.splice(0, 1)
  state.players[playerIndex].hand.push(...group.cards.map((c) => c.color))
  state.dealerHasClaimedFinal = true
}

function canEndRound(playerIndex) {
  return (
    state.phase === 'dealer-final' &&
    !state.pendingBlueReturn &&
    playerIndex === state.dealerIndex &&
    state.dealerHasClaimedFinal
  )
}

function endRound() {
  if (!canEndRound(state.dealerIndex)) return
  if (state.deck.length === 0) {
    state.phase = 'game-over'
    return
  }
  const n = state.players.length
  state.dealerIndex = (state.dealerIndex + 1) % n
  state.round++
  startDealingRound()
}

// --- Abilities ---

function canTrashFour(playerIndex, color) {
  if (!isActionWindow(playerIndex)) return false
  return countColor(state.players[playerIndex].hand, color) >= 4
}

function trashFour(playerIndex, color) {
  if (!canTrashFour(playerIndex, color)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, color, 4)
  state.discardByColor[color] += 4
}

function canUseBlueAbility(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return countColor(state.players[playerIndex].hand, 'blue') >= 2 && state.deck.length > 0
}

function useBlueAbilityDraw(playerIndex) {
  if (!canUseBlueAbility(playerIndex)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'blue', 2)
  state.discardByColor.blue += 2
  const drawn = state.deck.shift()
  player.hand.push(drawn)
  state.pendingBlueReturn = { playerIndex }
}

function blueReturnCandidates(playerIndex) {
  if (!state.pendingBlueReturn || state.pendingBlueReturn.playerIndex !== playerIndex) return []
  return [...new Set(state.players[playerIndex].hand)]
}

function resolveBlueReturn(playerIndex, color) {
  if (!state.pendingBlueReturn || state.pendingBlueReturn.playerIndex !== playerIndex) return
  const player = state.players[playerIndex]
  if (countColor(player.hand, color) < 1) return
  removeFromHand(player.hand, color, 1)
  state.deck.push(color)
  state.pendingBlueReturn = null
}

function canUseRedAbility(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return redAbilityTargets(playerIndex).length > 0
}

function redAbilityTargets(playerIndex) {
  const hand = [...state.players[playerIndex].hand]
  if (countColor(hand, 'red') < 2) return []
  removeFromHand(hand, 'red', 2)
  return [...new Set(hand)]
}

function useRedAbility(playerIndex, trashColor) {
  if (!redAbilityTargets(playerIndex).includes(trashColor)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'red', 2)
  state.discardByColor.red += 2
  removeFromHand(player.hand, trashColor, 1)
  state.discardByColor[trashColor] += 1
}

function canUseYellowAbility(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return yellowTargetCandidates(playerIndex).length > 0
}

function yellowTargetCandidates(playerIndex) {
  const hand = [...state.players[playerIndex].hand]
  if (countColor(hand, 'yellow') < 2) return []
  removeFromHand(hand, 'yellow', 2)
  const others = COLORS.filter((c) => c !== 'yellow')
  const counts = others.map((c) => ({ color: c, count: countColor(hand, c) })).filter((x) => x.count > 0)
  if (counts.length === 0) return []
  const min = Math.min(...counts.map((x) => x.count))
  return counts.filter((x) => x.count === min).map((x) => x.color)
}

function useYellowAbility(playerIndex, chosenColor) {
  if (!yellowTargetCandidates(playerIndex).includes(chosenColor)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'yellow', 2)
  state.discardByColor.yellow += 2
  const n = countColor(player.hand, chosenColor)
  removeFromHand(player.hand, chosenColor, n)
  state.discardByColor[chosenColor] += n
}

function canUseGreenAbility(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  if (state.phase !== 'picking' && state.phase !== 'dealer-final') return false
  if (countColor(state.players[playerIndex].hand, 'green') < 2) return false
  return state.groups.some((g) => g.cards.length > 0)
}

function useGreenAbility(playerIndex, groupId, cardId) {
  if (!canUseGreenAbility(playerIndex)) return
  const group = state.groups.find((g) => g.id === groupId)
  if (!group) return
  const idx = group.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'green', 2)
  state.discardByColor.green += 2
  const [card] = group.cards.splice(idx, 1)
  player.hand.push(card.color)
}

// The 2 white potions together count as 1 more card of a color the player
// chooses, so paired with 3 real cards of that color they total a 4-of-a-kind
// that gets trashed (5 physical cards leave the hand: the 2 white plus the 3 real).
function canUseWhiteAbility(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return whiteColorOptions(playerIndex).length > 0
}

function whiteColorOptions(playerIndex) {
  const hand = state.players[playerIndex].hand
  if (countColor(hand, 'white') < 2) return []
  return COLORS.filter((c) => c !== 'white' && countColor(hand, c) >= 3)
}

function useWhiteAbility(playerIndex, color) {
  if (!whiteColorOptions(playerIndex).includes(color)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'white', 2)
  state.discardByColor.white += 2
  removeFromHand(player.hand, color, 3)
  state.discardByColor[color] += 3
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.dealerIndex = 0
  state.round = 1
  state.totalRounds = 0
  state.cardsPerRound = 0
  state.deck = []
  state.removedCount = 0
  state.discardByColor = {}
  state.pool = []
  state.groups = []
  state.pickOrder = []
  state.pickPointer = 0
  state.pickerHasPicked = false
  state.dealerHasClaimedFinal = false
  state.pendingBlueReturn = null
}

export function useGameState() {
  return {
    state,
    turnPlayerIndex,
    turnPlayer,
    countColor,
    startGame,
    assignPoolCardToGroup,
    returnGroupCardToPool,
    moveGroupCardToGroup,
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
    canUseWhiteAbility,
    whiteColorOptions,
    useWhiteAbility,
    resetGame,
  }
}
