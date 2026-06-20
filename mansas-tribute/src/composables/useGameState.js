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
  const perSuit = (n * 8 + 8) / 4
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
  king: { deck: [], revealed: null },
  round: 0,
  trumpSuit: null,
  leadSuit: null,
  leadPlayerIndex: 0,
  currentPlayerIndex: 0,
  trick: [],
  trickResult: null,   // { winnerIndex, losers: playerIndex[] }
  dicePool: [],
  dicePickingTurn: 0,
})

function startGame(playerNames) {
  _uid = 0
  const n = playerNames.length
  const deck = buildDeck(n)

  state.players = playerNames.map((name, i) => ({
    name,
    hand: deck.slice(i * 8, i * 8 + 8),
    dice: Array.from({ length: 4 }, makeDie),
    tricks: 0,
  }))

  state.king = {
    deck: deck.slice(n * 8, n * 8 + 8),
    revealed: null,
  }

  state.round = 0
  state.leadPlayerIndex = 0
  _startRound()
}

function _startRound() {
  state.round++
  state.king.revealed = state.king.deck[state.round - 1]
  state.trumpSuit = state.king.revealed.suit
  state.leadSuit = null
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

  if (state.trick.length === 0) state.leadSuit = card.suit

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
  const { winner, losers } = determineTrickWinner(
    state.trick, state.leadSuit, state.trumpSuit
  )
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
