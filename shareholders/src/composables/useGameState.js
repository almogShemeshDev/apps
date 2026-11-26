import { reactive, computed } from 'vue'
import { buildDeck, emptyCompanyCounts, computeLowestCompanies, computeScore } from '../constants.js'

let nextLogId = 1

const state = reactive({
  phase: 'setup', // 'setup' | 'playing' | 'game-over'
  players: [],
  deck: [],
  row: [], // face-up cards dealt this round, waiting to be drafted
  pool: emptyCompanyCounts(), // trains played so far, per company
  activePlayerIndex: 0,
  startingPlayerIndex: 0, // who started the current round (stays fixed until the round changes)
  pickedThisRound: 0,
  round: 1,
  removedCompanies: [], // companies whose trains were the lowest-count — shares in them score negatively
  log: [], // [{ id, type, round, ...typeSpecificData }], oldest first
})

const activePlayer = computed(() => state.players[state.activePlayerIndex])

function pushLog(type, data) {
  state.log.push({ id: nextLogId++, type, round: state.round, ...data })
}

function createPlayer(input) {
  const name = typeof input === 'string' ? input : input.name
  const isBot = typeof input === 'string' ? false : !!input.isBot
  return { name, isBot, shares: emptyCompanyCounts(), score: 0 }
}

function dealRow() {
  const count = Math.min(state.players.length + 1, state.deck.length)
  state.row = state.deck.splice(0, count)
}

function startGame(playerInputs) {
  state.players = playerInputs.map((input) => createPlayer(input))
  state.deck = buildDeck()
  state.pool = emptyCompanyCounts()
  state.round = 1
  state.pickedThisRound = 0
  state.removedCompanies = []
  state.log = []
  state.activePlayerIndex = Math.floor(Math.random() * state.players.length)
  state.startingPlayerIndex = state.activePlayerIndex
  dealRow()
  state.phase = 'playing'
  pushLog('round-start', { round: state.round, playerName: activePlayer.value.name })
}

function applyCard(player, card) {
  if (card.kind === 'share') player.shares[card.company]++
  else state.pool[card.company]++
}

function pickCard(rowIndex) {
  if (state.phase !== 'playing') return
  const card = state.row[rowIndex]
  if (!card) return

  const pickerIndex = state.activePlayerIndex
  const player = state.players[pickerIndex]
  state.row.splice(rowIndex, 1)
  applyCard(player, card)
  pushLog('pick', { playerName: player.name, kind: card.kind, company: card.company })

  state.pickedThisRound++

  const roundDone = state.pickedThisRound >= state.players.length || state.row.length === 0
  if (!roundDone) {
    state.activePlayerIndex = (pickerIndex + 1) % state.players.length
    return
  }

  // The last player to pick this round starts the next one.
  state.activePlayerIndex = pickerIndex
  state.startingPlayerIndex = pickerIndex

  if (state.row.length) {
    pushLog('discard', { count: state.row.length })
    state.row = []
  }

  if (state.deck.length === 0) {
    endGame()
    return
  }

  state.round++
  state.pickedThisRound = 0
  dealRow()
  pushLog('round-start', { round: state.round, playerName: activePlayer.value.name })
}

function endGame() {
  state.removedCompanies = computeLowestCompanies(state.pool)
  for (const player of state.players) {
    player.score = computeScore(player.shares, state.pool, state.removedCompanies)
  }

  state.phase = 'game-over'
  pushLog('game-over', {})
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.deck = []
  state.row = []
  state.pool = emptyCompanyCounts()
  state.activePlayerIndex = 0
  state.startingPlayerIndex = 0
  state.pickedThisRound = 0
  state.round = 1
  state.removedCompanies = []
  state.log = []
}

export function useGameState() {
  return {
    state,
    activePlayer,
    startGame,
    pickCard,
    resetGame,
  }
}
