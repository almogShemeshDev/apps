import { reactive } from 'vue'
import {
  buildTileDeck,
  STARTING_TIME_TOKENS,
  MARKET_SIZE,
  POINTS_PER_PHOTO,
  sequenceBonusForLength,
  VARIETY_BONUS_THEMES,
  VARIETY_BONUS_POINTS,
} from '../constants.js'
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

function startGame(playerInputs) {
  state.players = playerInputs.map((p) => ({
    name: typeof p === 'string' ? p : p.name,
    isBot: typeof p === 'string' ? false : !!p.isBot,
    time: STARTING_TIME_TOKENS,
    tracks: { creativity: 0, equipment: 0, knowledge: 0, darkroom: 0 },
    bag: { white: 0, black: 0 },
    filmStrip: [],
  }))

  const deck = buildTileDeck(playerInputs.length)
  state.market = deck.splice(0, MARKET_SIZE)
  state.drawPile = deck
  state.currentPlayerIndex = Math.floor(Math.random() * playerInputs.length)
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
    player.time >= tile.cost &&
    player.tracks.creativity >= tile.reqCreativity &&
    player.tracks.equipment >= tile.reqEquipment
  )
}

function canBuyUpgrade(tile, player) {
  return player.time >= tile.cost
}

function takePhoto(tileId) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market.find((t) => t.id === tileId)
  if (!tile || !canTakePhoto(tile, player)) return

  player.time -= tile.cost
  player.filmStrip.push({
    id: tile.id,
    category: tile.category,
    subject: tile.subject,
    cost: tile.cost,
    developed: null,
  })
  player.bag.white++
  player.bag.black++

  _removeFromMarket(tileId)
  _refillMarket()
  if (!_checkEndCondition()) _advanceTurn()
}

function buyUpgrade(tileId, track) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market.find((t) => t.id === tileId)
  if (!tile || !canBuyUpgrade(tile, player)) return

  player.time -= tile.cost
  player.tracks[track]++

  if (track === 'knowledge' && player.bag.black > 0) {
    player.bag.black--
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

function _calcSequenceBonus(filmStrip) {
  let bonus = 0
  let runLen = 0
  let runCategory = null
  for (const photo of filmStrip) {
    if (photo.developed && photo.category === runCategory) {
      runLen++
    } else if (photo.developed) {
      bonus += sequenceBonusForLength(runLen)
      runCategory = photo.category
      runLen = 1
    } else {
      bonus += sequenceBonusForLength(runLen)
      runCategory = null
      runLen = 0
    }
  }
  bonus += sequenceBonusForLength(runLen)
  return bonus
}

function _calcVarietyBonus(filmStrip) {
  const themes = new Set(filmStrip.filter((ph) => ph.developed).map((ph) => ph.category))
  return themes.size >= VARIETY_BONUS_THEMES ? VARIETY_BONUS_POINTS : 0
}

function _calcScores() {
  state.scores = state.players.map((p) => {
    const photoScore = p.filmStrip.filter((ph) => ph.developed).length * POINTS_PER_PHOTO
    const sequenceBonus = _calcSequenceBonus(p.filmStrip)
    const varietyBonus = _calcVarietyBonus(p.filmStrip)
    return {
      name: p.name,
      photoScore,
      sequenceBonus,
      varietyBonus,
      total: photoScore + sequenceBonus + varietyBonus,
    }
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
