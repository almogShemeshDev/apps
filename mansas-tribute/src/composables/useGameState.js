import { reactive } from 'vue'
import { SUITS } from '../constants.js'
import { determineTrickWinner } from './useTrickLogic.js'

let _uid = 0
const uid = () => _uid++

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(n) {
  const perSuit = (n * 8 + 16) / 4
  return shuffle(SUITS.flatMap(suit =>
    Array.from({ length: perSuit }, () => ({ id: uid(), suit }))
  ))
}

function makeDie() {
  return { id: uid(), value: Math.ceil(Math.random() * 6) }
}

const state = reactive({
  phase: 'setup',
  players: [],
  king: { deck: [], revealed: null, trump: null },
  round: 0,
  leadSuit: null,
  trumpSuit: null,
  leadPlayerIndex: 0,
  currentPlayerIndex: 0,
  trick: [],
  trickResult: null,
  dicePool: [],
  dicePickingTurn: 0,
})

function startGame(playerInputs) {
  _uid = 0
  const n = playerInputs.length
  const deck = buildDeck(n)

  state.players = playerInputs.map((p, i) => ({
    name: typeof p === 'string' ? p : p.name,
    isBot: typeof p === 'string' ? false : !!p.isBot,
    hand: deck.slice(i * 8, i * 8 + 8),
    dice: Array.from({ length: 4 }, makeDie),
    tricks: 0,
  }))

  // Reserve 16 cards for the king as before (keeps per-suit counts divisible by 4);
  // the new leading/trump mechanic only consumes 9 of them across 8 rounds.
  state.king = {
    deck: deck.slice(n * 8, n * 8 + 16),
    revealed: null,
    trump: null,
  }

  state.round = 0
  state.leadPlayerIndex = Math.floor(Math.random() * n)
  _startRound()
}

function _startRound() {
  state.round++
  if (state.round === 1) {
    // King draws two cards to open the game: one leading, one trump.
    state.king.revealed = state.king.deck[0]
    state.king.trump = state.king.deck[1]
  } else {
    // Last round's leading card becomes this round's trump; king deals a fresh leading card.
    state.king.trump = state.king.revealed
    state.king.revealed = state.king.deck[state.round]
  }
  state.leadSuit = state.king.revealed.suit
  state.trumpSuit = state.king.trump.suit
  state.trick = []
  state.trickResult = null
  state.dicePool = []
  state.dicePickingTurn = 0
  state.currentPlayerIndex = state.leadPlayerIndex
  state.phase = 'playing'
}

function playCard(card, diceIds) {
  const pi = state.currentPlayerIndex
  const player = state.players[pi]

  player.hand = player.hand.filter(c => c.id !== card.id)
  const playedDice = player.dice.filter(d => diceIds.includes(d.id))
  player.dice = player.dice.filter(d => !diceIds.includes(d.id))

  state.trick.push({ playerIndex: pi, card, dice: playedDice })

  if (state.trick.length === state.players.length) {
    _resolveTrick()
  } else {
    state.currentPlayerIndex = (pi + 1) % state.players.length
  }
}

function _resolveTrick() {
  const { winner, losers } = determineTrickWinner(state.trick, state.leadSuit, state.trumpSuit)
  state.players[winner.playerIndex].tricks++
  state.dicePool = state.trick.flatMap(e => e.dice)
  state.trickResult = {
    winnerIndex: winner.playerIndex,
    losers: losers.map(e => e.playerIndex),
  }
  state.phase = 'trick-result'
}

function proceedToDicePicking() {
  if (!state.trickResult.losers.length || !state.dicePool.length) {
    _finishTrick()
    return
  }
  state.dicePickingTurn = 0
  state.phase = 'dice-picking'
}

function pickDie(dieId) {
  const pi = state.trickResult.losers[state.dicePickingTurn]
  const idx = state.dicePool.findIndex(d => d.id === dieId)
  if (idx !== -1) {
    state.players[pi].dice.push(state.dicePool.splice(idx, 1)[0])
  }
  _advancePicking()
}

function passPicking() {
  _advancePicking()
}

function _advancePicking() {
  state.dicePickingTurn++
  if (state.dicePickingTurn >= state.trickResult.losers.length || !state.dicePool.length) {
    _finishTrick()
  }
}

function _finishTrick() {
  state.leadPlayerIndex = state.trickResult.winnerIndex
  if (state.round >= 8) {
    state.phase = 'game-over'
  } else {
    _startRound()
  }
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
}

export function useGameState() {
  return { state, startGame, playCard, proceedToDicePicking, pickDie, passPicking, resetGame }
}
