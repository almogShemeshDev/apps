import { reactive } from 'vue'
import { buildTileDeck, STARTING_TIME_TOKENS, MARKET_SIZE, MIN_RUN_LENGTH, RUN_BONUS_PER_TILE } from '../constants.js'
import { drawCube } from './useDevelopment.js'

const state = reactive({
  phase: 'setup', // 'setup' | 'playing' | 'development' | 'game-over'
  players: [],
  market: [],
  drawPile: [],
  currentPlayerIndex: 0,
  development: null,
  scores: [],
})

function currentPlayer() {
  return state.players[state.currentPlayerIndex]
}

function startGame(names) {
  state.players = names.map((name) => ({
    name,
    time: STARTING_TIME_TOKENS,
    tracks: { creativity: 0, equipment: 0, knowledge: 0, darkroom: 0 },
    bag: { white: 0, black: 0 },
    filmStrip: [],
  }))

  const deck = buildTileDeck(names.length)
  state.market = deck.splice(0, MARKET_SIZE)
  state.drawPile = deck
  state.currentPlayerIndex = 0
  state.development = null
  state.scores = []
  state.phase = 'playing'
}

function _refillMarket() {
  while (state.market.length < MARKET_SIZE && state.drawPile.length) {
    state.market.push(state.drawPile.shift())
  }
}

function _removeFromMarket(tileId) {
  const idx = state.market.findIndex((t) => t.id === tileId)
  if (idx === -1) return null
  return state.market.splice(idx, 1)[0]
}

function _advanceTurn() {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
}

function _checkEndCondition() {
  if (!state.market.length && !state.drawPile.length) {
    _startDevelopment()
    return true
  }
  return false
}

function canTakePhoto(tile, player) {
  return (
    player.time >= tile.photo.cost &&
    player.tracks.creativity >= tile.photo.reqCreativity &&
    player.tracks.equipment >= tile.photo.reqEquipment
  )
}

function canBuyUpgrade(tile, player) {
  return player.time >= tile.upgrade.cost
}

function takePhoto(tileId) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market.find((t) => t.id === tileId)
  if (!tile || !canTakePhoto(tile, player)) return

  player.time -= tile.photo.cost
  player.filmStrip.push({
    id: tile.id,
    category: tile.photo.category,
    subject: tile.photo.subject,
    cost: tile.photo.cost,
    developed: null,
  })
  player.bag.white++
  player.bag.black++

  _removeFromMarket(tileId)
  _refillMarket()
  if (!_checkEndCondition()) _advanceTurn()
}

function buyUpgrade(tileId) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market.find((t) => t.id === tileId)
  if (!tile || !canBuyUpgrade(tile, player)) return

  player.time -= tile.upgrade.cost
  player.tracks[tile.upgrade.track]++

  if (tile.upgrade.track === 'knowledge') {
    if (player.bag.black > 0) player.bag.black--
  } else {
    player.bag.black++
  }

  _removeFromMarket(tileId)
  _refillMarket()
  if (!_checkEndCondition()) _advanceTurn()
}

function pass() {
  if (state.phase !== 'playing') return
  currentPlayer().time++
  _advanceTurn()
}

function _startDevelopment() {
  state.phase = 'development'
  state.development = {
    playerIndex: 0,
    photoIndex: 0,
    darkroomUsesRemaining: state.players[0].tracks.darkroom,
    lastResult: null,
    playerFinished: state.players[0].filmStrip.length === 0,
  }
}

function developNextPhoto() {
  if (state.phase !== 'development') return
  const dev = state.development
  const player = state.players[dev.playerIndex]
  const photo = player.filmStrip[dev.photoIndex]
  if (!photo) return

  let usedDarkroom = false
  let result = drawCube(player.bag)
  while (result === 'black' && dev.darkroomUsesRemaining > 0) {
    dev.darkroomUsesRemaining--
    usedDarkroom = true
    result = drawCube(player.bag)
  }

  photo.developed = result === 'white'
  dev.lastResult = {
    subject: photo.subject,
    category: photo.category,
    developed: photo.developed,
    savedByDarkroom: usedDarkroom && photo.developed,
  }

  dev.photoIndex++
  if (dev.photoIndex >= player.filmStrip.length) {
    dev.playerFinished = true
  }
}

function continueDevelopment() {
  if (state.phase !== 'development') return
  const dev = state.development
  if (!dev.playerFinished) return

  if (dev.playerIndex + 1 >= state.players.length) {
    _calcScores()
    state.phase = 'game-over'
    return
  }

  dev.playerIndex++
  dev.photoIndex = 0
  dev.darkroomUsesRemaining = state.players[dev.playerIndex].tracks.darkroom
  dev.lastResult = null
  dev.playerFinished = state.players[dev.playerIndex].filmStrip.length === 0
}

function _runBonusForLength(len) {
  if (len < MIN_RUN_LENGTH) return 0
  return (len - (MIN_RUN_LENGTH - 1)) * RUN_BONUS_PER_TILE
}

function _calcRunBonus(filmStrip) {
  let bonus = 0
  let runLen = 0
  let runCategory = null
  for (const photo of filmStrip) {
    if (photo.developed && photo.category === runCategory) {
      runLen++
    } else if (photo.developed) {
      bonus += _runBonusForLength(runLen)
      runCategory = photo.category
      runLen = 1
    } else {
      bonus += _runBonusForLength(runLen)
      runCategory = null
      runLen = 0
    }
  }
  bonus += _runBonusForLength(runLen)
  return bonus
}

function _calcScores() {
  state.scores = state.players.map((p) => {
    const photoScore = p.filmStrip.filter((ph) => ph.developed).reduce((s, ph) => s + ph.cost, 0)
    const bonus = _calcRunBonus(p.filmStrip)
    return { name: p.name, photoScore, bonus, total: photoScore + bonus }
  })
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.market = []
  state.drawPile = []
  state.currentPlayerIndex = 0
  state.development = null
  state.scores = []
}

export function useGameState() {
  return {
    state,
    currentPlayer,
    canTakePhoto,
    canBuyUpgrade,
    startGame,
    takePhoto,
    buyUpgrade,
    pass,
    developNextPhoto,
    continueDevelopment,
    resetGame,
  }
}
