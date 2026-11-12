import { reactive } from 'vue'
import {
  buildTileDeck,
  STARTING_TIME_TOKENS,
  MARKET_SIZE,
  GAME_END_PHOTO_COUNT,
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
  marketTokens: [],
  drawPile: [],
  currentPlayerIndex: 0,
  roundStartPlayerIndex: 0,
  endPending: false,
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
    tracks: { creativity: 0, equipment: 0, development: 0, darkroom: 0 },
    bag: { white: 0, black: 0 },
    filmStrip: [],
  }))

  const deck = buildTileDeck()
  state.market = deck.splice(0, MARKET_SIZE)
  state.marketTokens = Array(MARKET_SIZE).fill(0)
  state.drawPile = deck
  state.currentPlayerIndex = Math.floor(Math.random() * playerInputs.length)
  state.roundStartPlayerIndex = state.currentPlayerIndex
  state.endPending = false
  state.development = null
  state.scores = []
  state.phase = 'playing'
}

// Position cost/number, 1-indexed from the rightmost slot (index 0).
function positionCost(idx) {
  return idx + 1
}

// A tile leaving position idx shifts every tile to its left (higher index)
// one step right; a fresh tile enters the vacated leftmost slot. Time tokens
// stay attached to their position and are never moved by this.
function _removeFromMarketAt(idx) {
  const tile = state.market[idx]
  for (let i = idx; i < MARKET_SIZE - 1; i++) {
    state.market[i] = state.market[i + 1]
  }
  state.market[MARKET_SIZE - 1] = state.drawPile.length ? state.drawPile.shift() : null
  return tile
}

function _maybeFlagSupplyExhausted() {
  if (!state.drawPile.length && state.market.every((t) => !t)) {
    state.endPending = true
  }
}

function _advanceTurn() {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
  if (state.endPending && state.currentPlayerIndex === state.roundStartPlayerIndex) {
    _startDevelopment()
  }
}

function canTakePhoto(tile, player) {
  return (
    !!tile &&
    player.time >= tile.cost &&
    player.tracks.creativity >= tile.reqCreativity &&
    player.tracks.equipment >= tile.reqEquipment
  )
}

function canBuyUpgrade(player, idx) {
  return !!state.market[idx] && player.time >= positionCost(idx)
}

function canCollectTime(idx) {
  return state.marketTokens[idx] > 0
}

function takePhoto(idx) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market[idx]
  if (!tile || !canTakePhoto(tile, player)) return

  player.time -= tile.cost
  state.marketTokens[idx] += tile.cost
  player.filmStrip.push({
    id: tile.id,
    category: tile.category,
    subject: tile.subject,
    cost: tile.cost,
    developed: null,
  })
  player.bag.white++
  player.bag.black++

  _removeFromMarketAt(idx)
  if (player.filmStrip.length >= GAME_END_PHOTO_COUNT) state.endPending = true
  _maybeFlagSupplyExhausted()
  _advanceTurn()
}

function buyUpgrade(idx, track) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  if (!canBuyUpgrade(player, idx)) return

  const cost = positionCost(idx)
  player.time -= cost
  for (let i = 0; i <= idx; i++) state.marketTokens[i] += 1
  player.tracks[track]++

  _removeFromMarketAt(idx)
  _maybeFlagSupplyExhausted()
  _advanceTurn()
}

function collectTime(idx) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const amount = state.marketTokens[idx]
  player.time += amount
  state.marketTokens[idx] = 0
  _advanceTurn()
}

function _startDevelopment() {
  state.phase = 'development'
  for (const p of state.players) {
    p.bag.white += p.tracks.development
  }
  state.development = {
    playerIndex: 0,
    photoIndex: 0,
    darkroomUsesRemaining: state.players[0].tracks.darkroom,
    lastResult: null,
    playerFinished: state.players[0].filmStrip.length === 0,
    awaitingDarkroomChoice: false,
  }
}

function _finalizePhoto(player, dev, developed, savedByDarkroom) {
  const photo = player.filmStrip[dev.photoIndex]
  photo.developed = developed
  dev.lastResult = {
    subject: photo.subject,
    category: photo.category,
    developed,
    savedByDarkroom,
  }
  dev.awaitingDarkroomChoice = false

  dev.photoIndex++
  if (dev.photoIndex >= player.filmStrip.length) {
    dev.playerFinished = true
  }
}

function developNextPhoto() {
  if (state.phase !== 'development') return
  const dev = state.development
  if (dev.awaitingDarkroomChoice) return
  const player = state.players[dev.playerIndex]
  const photo = player.filmStrip[dev.photoIndex]
  if (!photo) return

  const result = drawCube(player.bag)
  if (result === 'white') {
    _finalizePhoto(player, dev, true, false)
    return
  }

  if (dev.darkroomUsesRemaining > 0) {
    dev.awaitingDarkroomChoice = true
  } else {
    _finalizePhoto(player, dev, false, false)
  }
}

function useDarkroom() {
  if (state.phase !== 'development') return
  const dev = state.development
  if (!dev.awaitingDarkroomChoice) return
  const player = state.players[dev.playerIndex]

  dev.darkroomUsesRemaining--
  dev.awaitingDarkroomChoice = false

  const result = drawCube(player.bag)
  if (result === 'white') {
    _finalizePhoto(player, dev, true, true)
    return
  }

  if (dev.darkroomUsesRemaining > 0) {
    dev.awaitingDarkroomChoice = true
  } else {
    _finalizePhoto(player, dev, false, false)
  }
}

function skipDarkroom() {
  if (state.phase !== 'development') return
  const dev = state.development
  if (!dev.awaitingDarkroomChoice) return
  const player = state.players[dev.playerIndex]
  _finalizePhoto(player, dev, false, false)
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
  dev.awaitingDarkroomChoice = false
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
  state.marketTokens = []
  state.drawPile = []
  state.currentPlayerIndex = 0
  state.roundStartPlayerIndex = 0
  state.endPending = false
  state.development = null
  state.scores = []
}

export function useGameState() {
  return {
    state,
    currentPlayer,
    positionCost,
    canTakePhoto,
    canBuyUpgrade,
    canCollectTime,
    startGame,
    takePhoto,
    buyUpgrade,
    collectTime,
    developNextPhoto,
    useDarkroom,
    skipDarkroom,
    continueDevelopment,
    resetGame,
  }
}
