import { reactive, computed } from 'vue'
import { COLORS, setupDeck } from '../constants.js'

let nextCardUid = 1
let nextLogId = 1

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
  log: [], // [{ id, type, round, ...typeSpecificData }], oldest first
})

// Turn order within the current round: the dealer deals first (and claims the
// leftover group last), then everyone else picks in clockwise order.
const turnOrder = computed(() => {
  const n = state.players.length
  if (!n) return []
  const d = state.dealerIndex
  return [d, ...Array.from({ length: n - 1 }, (_, i) => (d + 1 + i) % n)]
})

function letterForIndex(i) {
  return String.fromCharCode(65 + i)
}

function pushLog(type, data) {
  state.log.push({ id: nextLogId++, type, round: state.round, ...data })
}

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

function createPlayer(input) {
  const name = typeof input === 'string' ? input : input.name
  const isBot = typeof input === 'string' ? false : !!input.isBot
  return { name, isBot, hand: [], flipPenalty: 0 }
}

// Pays the cards that trigger an ability. A normal activation (4 of a color)
// trashes them into the shared discard pile with no further cost. A "flip"
// activation (2 of a color) sets them aside face-down instead — they no
// longer count in the player's hand, but they cost 2 VP together at the end
// of the game (tracked on the player, not the shared discard pile).
function payAbilityCost(playerIndex, color, flip) {
  const player = state.players[playerIndex]
  const cost = flip ? 2 : 4
  removeFromHand(player.hand, color, cost)
  if (flip) {
    player.flipPenalty += 2
  } else {
    state.discardByColor[color] += cost
  }
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
  pushLog('round-start', { playerName: state.players[state.dealerIndex].name })
}

function startGame(playerInputs) {
  const n = playerInputs.length
  const { deck, removedCount, cardsPerRound, totalRounds } = setupDeck(n)
  state.players = playerInputs.map(createPlayer)
  state.dealerIndex = Math.floor(Math.random() * n)
  state.round = 1
  state.totalRounds = totalRounds
  state.cardsPerRound = cardsPerRound
  state.deck = deck
  state.removedCount = removedCount
  state.discardByColor = Object.fromEntries(COLORS.map((c) => [c, 0]))
  state.pendingBlueReturn = null
  state.log = []
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
  return (
    state.phase === 'dealing' &&
    state.pool.length === 0 &&
    !state.pendingBlueReturn &&
    state.groups.every((g) => g.cards.length > 0)
  )
}

function confirmGroups() {
  if (!canConfirmGroups()) return
  const n = state.players.length
  state.pickOrder = Array.from({ length: n - 1 }, (_, i) => (state.dealerIndex + 1 + i) % n)
  state.pickPointer = 0
  state.pickerHasPicked = false
  state.phase = 'picking'
  pushLog('deal', { playerName: state.players[state.dealerIndex].name })
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
  const letter = letterForIndex(idx)
  const [group] = state.groups.splice(idx, 1)
  const colors = group.cards.map((c) => c.color)
  state.players[playerIndex].hand.push(...colors)
  state.pickerHasPicked = true
  pushLog('pick', { playerName: state.players[playerIndex].name, letter, colors })
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
  const colors = group.cards.map((c) => c.color)
  state.players[playerIndex].hand.push(...colors)
  state.dealerHasClaimedFinal = true
  pushLog('claim-final', { playerName: state.players[playerIndex].name, colors })
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
    pushLog('game-over', {})
    return
  }
  const n = state.players.length
  state.dealerIndex = (state.dealerIndex + 1) % n
  state.round++
  startDealingRound()
}

// --- Abilities ---

function canTrashThree(playerIndex, color) {
  if (!isActionWindow(playerIndex)) return false
  return countColor(state.players[playerIndex].hand, color) >= 3
}

function trashThree(playerIndex, color) {
  if (!canTrashThree(playerIndex, color)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, color, 3)
  state.discardByColor[color] += 3
  pushLog('trash-three', { playerName: player.name, color })
}

// A player holding 4+ of a color is normally expected to spend them on that
// color's ability, but if the ability has no valid target right now (e.g. no
// other color in hand for Red, an empty deck for Blue, nothing in any group
// for Green, or no valid merge color for White), they shouldn't be stuck —
// they can trash all 4 for no effect instead. There's no equivalent fallback
// for the 2-card flip: flipping without using the ability would just be a
// pure -2 VP penalty for nothing, so no one would ever want it.
function canUseColorAbilityNormal(playerIndex, color) {
  switch (color) {
    case 'blue':
      return canUseBlueAbility(playerIndex, false)
    case 'red':
      return canUseRedAbility(playerIndex, false)
    case 'yellow':
      return canUseYellowAbility(playerIndex, false)
    case 'green':
      return canUseGreenAbility(playerIndex, false)
    case 'white':
      return canUseWhiteConversion(playerIndex)
    default:
      return false
  }
}

function canTrashFour(playerIndex, color) {
  if (!isActionWindow(playerIndex)) return false
  if (countColor(state.players[playerIndex].hand, color) < 4) return false
  return !canUseColorAbilityNormal(playerIndex, color)
}

function trashFour(playerIndex, color) {
  if (!canTrashFour(playerIndex, color)) return
  const player = state.players[playerIndex]
  removeFromHand(player.hand, color, 4)
  state.discardByColor[color] += 4
  pushLog('trash-four', { playerName: player.name, color })
}

function canUseBlueAbility(playerIndex, flip = false) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  const need = flip ? 2 : 4
  return countColor(state.players[playerIndex].hand, 'blue') >= need && state.deck.length > 0
}

function useBlueAbilityDraw(playerIndex, flip = false) {
  if (!canUseBlueAbility(playerIndex, flip)) return
  const player = state.players[playerIndex]
  payAbilityCost(playerIndex, 'blue', flip)
  const drawn = state.deck.shift()
  player.hand.push(drawn)
  state.pendingBlueReturn = { playerIndex }
  pushLog(flip ? 'blue-draw-flip' : 'blue-draw', { playerName: player.name, color: drawn })
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
  pushLog('blue-return', { playerName: player.name, color })
}

function canUseRedAbility(playerIndex, flip = false) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return redAbilityTargets(playerIndex, flip).length > 0
}

function redAbilityTargets(playerIndex, flip = false) {
  const hand = [...state.players[playerIndex].hand]
  const need = flip ? 2 : 4
  if (countColor(hand, 'red') < need) return []
  removeFromHand(hand, 'red', need)
  return [...new Set(hand)]
}

function useRedAbility(playerIndex, trashColor, flip = false) {
  if (!redAbilityTargets(playerIndex, flip).includes(trashColor)) return
  const player = state.players[playerIndex]
  payAbilityCost(playerIndex, 'red', flip)
  removeFromHand(player.hand, trashColor, 1)
  state.discardByColor[trashColor] += 1
  pushLog(flip ? 'red-flip' : 'red', { playerName: player.name, color: trashColor })
}

function canUseYellowAbility(playerIndex, flip = false) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return yellowTargetCandidates(playerIndex, flip).length > 0
}

function yellowTargetCandidates(playerIndex, flip = false) {
  const hand = [...state.players[playerIndex].hand]
  const need = flip ? 2 : 4
  if (countColor(hand, 'yellow') < need) return []
  removeFromHand(hand, 'yellow', need)
  const others = COLORS.filter((c) => c !== 'yellow')
  const counts = others.map((c) => ({ color: c, count: countColor(hand, c) })).filter((x) => x.count > 0)
  if (counts.length === 0) return []
  const min = Math.min(...counts.map((x) => x.count))
  return counts.filter((x) => x.count === min).map((x) => x.color)
}

function useYellowAbility(playerIndex, chosenColor, flip = false) {
  if (!yellowTargetCandidates(playerIndex, flip).includes(chosenColor)) return
  const player = state.players[playerIndex]
  payAbilityCost(playerIndex, 'yellow', flip)
  const n = countColor(player.hand, chosenColor)
  removeFromHand(player.hand, chosenColor, n)
  state.discardByColor[chosenColor] += n
  pushLog(flip ? 'yellow-flip' : 'yellow', { playerName: player.name, color: chosenColor, count: n })
}

function canUseGreenAbility(playerIndex, flip = false) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  if (state.phase !== 'picking' && state.phase !== 'dealer-final') return false
  const need = flip ? 2 : 4
  if (countColor(state.players[playerIndex].hand, 'green') < need) return false
  return state.groups.some((g) => g.cards.length > 0)
}

function useGreenAbility(playerIndex, groupId, cardId, flip = false) {
  if (!canUseGreenAbility(playerIndex, flip)) return
  const group = state.groups.find((g) => g.id === groupId)
  if (!group) return
  const idx = group.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const player = state.players[playerIndex]
  payAbilityCost(playerIndex, 'green', flip)
  const [card] = group.cards.splice(idx, 1)
  player.hand.push(card.color)
  pushLog(flip ? 'green-flip' : 'green', { playerName: player.name, color: card.color })
}

// --- White: convert 2 white potions into 1 wildcard potion of another color ---
// The wildcard merges with the player's real holdings of that color: 1 real
// (+1 wildcard = 2) triggers that color's flip-ability (and the usual -2 VP
// flip penalty), 2 real (+1 = 3) is a plain trash with no effect, 3 real
// (+1 = 4) triggers that color's trash + ability. Spending the 2 white
// potions is always a normal discard — it's not a "flip" of white itself, so
// it never adds to flipPenalty on its own. White has no separate 4-cost tier.

function whiteConversionOutcome(playerIndex, color) {
  const real = countColor(state.players[playerIndex].hand, color)
  const total = real + 1
  if (total === 2) return 'flip'
  if (total === 3) return 'trash'
  if (total === 4) return 'ability'
  return null
}

function whiteConversionOptions(playerIndex) {
  const hand = state.players[playerIndex].hand
  if (countColor(hand, 'white') < 2) return []
  return COLORS.filter((c) => {
    if (c === 'white') return false
    const outcome = whiteConversionOutcome(playerIndex, c)
    if (!outcome) return false
    if (outcome === 'trash') return true
    if (c === 'blue') return state.deck.length > 0
    if (c === 'green') {
      if (state.phase !== 'picking' && state.phase !== 'dealer-final') return false
      return state.groups.some((g) => g.cards.length > 0)
    }
    return true
  })
}

function canUseWhiteConversion(playerIndex) {
  if (!isActionWindow(playerIndex) || state.pendingBlueReturn) return false
  return whiteConversionOptions(playerIndex).length > 0
}

// Pays the 2 white + the real merge cards of `color` — common to every outcome.
function payWhiteConversion(playerIndex, color, realNeeded) {
  const player = state.players[playerIndex]
  removeFromHand(player.hand, 'white', 2)
  state.discardByColor.white += 2
  removeFromHand(player.hand, color, realNeeded)
}

function realNeededFor(outcome) {
  return outcome === 'flip' ? 1 : 3
}

// The 'trash' outcome (merged total of 3) needs no further choice — resolves immediately.
function useWhiteConversionTrash(playerIndex, color) {
  if (whiteConversionOutcome(playerIndex, color) !== 'trash') return
  const player = state.players[playerIndex]
  payWhiteConversion(playerIndex, color, 2)
  state.discardByColor[color] += 2
  pushLog('white-convert-trash', { playerName: player.name, color })
}

// Blue's effect (draw + pending return) needs no sub-choice beyond the deck check.
function useWhiteConversionBlue(playerIndex) {
  const outcome = whiteConversionOutcome(playerIndex, 'blue')
  if ((outcome !== 'flip' && outcome !== 'ability') || !state.deck.length) return
  const player = state.players[playerIndex]
  const realNeeded = realNeededFor(outcome)
  payWhiteConversion(playerIndex, 'blue', realNeeded)
  if (outcome === 'flip') player.flipPenalty += 2
  else state.discardByColor.blue += realNeeded
  const drawn = state.deck.shift()
  player.hand.push(drawn)
  state.pendingBlueReturn = { playerIndex }
  pushLog(outcome === 'flip' ? 'white-convert-blue-flip' : 'white-convert-blue', {
    playerName: player.name,
    color: drawn,
  })
}

// Yellow's effect (trash the least-held other color) may still tie between
// colors, so it needs a candidate list the same way the normal ability does.
function whiteConversionYellowTargets(playerIndex) {
  const outcome = whiteConversionOutcome(playerIndex, 'yellow')
  if (outcome !== 'flip' && outcome !== 'ability') return []
  const hand = [...state.players[playerIndex].hand]
  removeFromHand(hand, 'white', 2)
  removeFromHand(hand, 'yellow', realNeededFor(outcome))
  const others = COLORS.filter((c) => c !== 'yellow')
  const counts = others.map((c) => ({ color: c, count: countColor(hand, c) })).filter((x) => x.count > 0)
  if (!counts.length) return []
  const min = Math.min(...counts.map((x) => x.count))
  return counts.filter((x) => x.count === min).map((x) => x.color)
}

function useWhiteConversionYellow(playerIndex, chosenColor) {
  if (!whiteConversionYellowTargets(playerIndex).includes(chosenColor)) return
  const outcome = whiteConversionOutcome(playerIndex, 'yellow')
  const realNeeded = realNeededFor(outcome)
  const player = state.players[playerIndex]
  payWhiteConversion(playerIndex, 'yellow', realNeeded)
  if (outcome === 'flip') player.flipPenalty += 2
  else state.discardByColor.yellow += realNeeded
  const n = countColor(player.hand, chosenColor)
  removeFromHand(player.hand, chosenColor, n)
  state.discardByColor[chosenColor] += n
  pushLog(outcome === 'flip' ? 'white-convert-yellow-flip' : 'white-convert-yellow', {
    playerName: player.name,
    color: chosenColor,
    count: n,
  })
}

// Red's effect (trash 1 of another color) needs the player to pick which color.
function whiteConversionRedTargets(playerIndex) {
  const outcome = whiteConversionOutcome(playerIndex, 'red')
  if (outcome !== 'flip' && outcome !== 'ability') return []
  const hand = [...state.players[playerIndex].hand]
  removeFromHand(hand, 'white', 2)
  removeFromHand(hand, 'red', realNeededFor(outcome))
  return [...new Set(hand)]
}

function useWhiteConversionRed(playerIndex, trashColor) {
  if (!whiteConversionRedTargets(playerIndex).includes(trashColor)) return
  const outcome = whiteConversionOutcome(playerIndex, 'red')
  const realNeeded = realNeededFor(outcome)
  const player = state.players[playerIndex]
  payWhiteConversion(playerIndex, 'red', realNeeded)
  if (outcome === 'flip') player.flipPenalty += 2
  else state.discardByColor.red += realNeeded
  removeFromHand(player.hand, trashColor, 1)
  state.discardByColor[trashColor] += 1
  pushLog(outcome === 'flip' ? 'white-convert-red-flip' : 'white-convert-red', {
    playerName: player.name,
    color: trashColor,
  })
}

// Green's effect (snipe a card from a dealt group) needs a board pick.
function canUseWhiteConversionGreen(playerIndex) {
  const outcome = whiteConversionOutcome(playerIndex, 'green')
  if (outcome !== 'flip' && outcome !== 'ability') return false
  if (state.phase !== 'picking' && state.phase !== 'dealer-final') return false
  return state.groups.some((g) => g.cards.length > 0)
}

function useWhiteConversionGreen(playerIndex, groupId, cardId) {
  if (!canUseWhiteConversionGreen(playerIndex)) return
  const group = state.groups.find((g) => g.id === groupId)
  if (!group) return
  const idx = group.cards.findIndex((c) => c.id === cardId)
  if (idx === -1) return
  const outcome = whiteConversionOutcome(playerIndex, 'green')
  const realNeeded = realNeededFor(outcome)
  const player = state.players[playerIndex]
  payWhiteConversion(playerIndex, 'green', realNeeded)
  if (outcome === 'flip') player.flipPenalty += 2
  else state.discardByColor.green += realNeeded
  const [card] = group.cards.splice(idx, 1)
  player.hand.push(card.color)
  pushLog(outcome === 'flip' ? 'white-convert-green-flip' : 'white-convert-green', {
    playerName: player.name,
    color: card.color,
  })
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
  state.log = []
}

export function useGameState() {
  return {
    state,
    turnPlayerIndex,
    turnPlayer,
    turnOrder,
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
    resetGame,
  }
}
