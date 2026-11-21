import { reactive } from 'vue'
import {
  buildTileDeck,
  STARTING_TIME_TOKENS,
  MARKET_SIZE,
  SHARED_PHOTO_THRESHOLD_PER_PLAYER,
  UPGRADE_TRACK_BY_INDEX,
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
  // Tokens paid above a position (by Photograph) and below a position (by
  // Upgrade) just sit there until a Gain Time action picks a pile to collect.
  aboveTokens: [],
  belowTokens: [],
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

function totalPhotos() {
  return state.players.reduce((sum, p) => sum + p.filmStrip.length, 0)
}

function photoThreshold() {
  return state.players.length * SHARED_PHOTO_THRESHOLD_PER_PLAYER
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
  state.aboveTokens = Array(MARKET_SIZE).fill(0)
  state.belowTokens = Array(MARKET_SIZE).fill(0)
  state.drawPile = deck
  state.currentPlayerIndex = Math.floor(Math.random() * playerInputs.length)
  state.roundStartPlayerIndex = state.currentPlayerIndex
  state.endPending = false
  state.development = null
  state.scores = []
  state.phase = 'playing'
}

// A tile leaving position idx is replaced in place by the next tile in the
// draw pile; every other position is untouched.
function _removeFromMarketAt(idx) {
  const tile = state.market[idx]
  state.market[idx] = state.drawPile.length ? state.drawPile.shift() : null
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
  if (!tile) return false
  return (
    player.time >= tile.cost &&
    player.tracks.creativity >= tile.reqCreativity &&
    player.tracks.equipment >= tile.reqEquipment
  )
}

function canBuyUpgrade(player, idx) {
  const tile = state.market[idx]
  return !!tile && player.time >= tile.cost
}

function _pileKey(pile) {
  return pile === 'above' ? 'aboveTokens' : 'belowTokens'
}

function canGainTime(pile, idx) {
  return state[_pileKey(pile)][idx] > 0
}

function takePhoto(idx) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const tile = state.market[idx]
  if (!tile || !canTakePhoto(tile, player)) return

  // Pay the full cost into the pile above this position.
  player.time -= tile.cost
  state.aboveTokens[idx] += tile.cost

  // Collect any Time tokens already waiting below this position.
  player.time += state.belowTokens[idx]
  state.belowTokens[idx] = 0

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

  if (totalPhotos() >= photoThreshold()) state.endPending = true
  _maybeFlagSupplyExhausted()
  _advanceTurn()
}

function buyUpgrade(idx) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  if (!canBuyUpgrade(player, idx)) return

  const tile = state.market[idx]
  const cost = tile.cost
  const track = UPGRADE_TRACK_BY_INDEX[idx]

  // Pay the full cost into the pile below this position.
  player.time -= cost
  state.belowTokens[idx] += cost
  player.tracks[track]++

  // Collect any Time tokens already waiting above this position.
  player.time += state.aboveTokens[idx]
  state.aboveTokens[idx] = 0

  _removeFromMarketAt(idx)
  _maybeFlagSupplyExhausted()
  _advanceTurn()
}

function gainTime(pile, idx) {
  if (state.phase !== 'playing') return
  const player = currentPlayer()
  const key = _pileKey(pile)
  player.time += state[key][idx]
  state[key][idx] = 0
  _advanceTurn()
}

// None of the three actions (Photograph, Upgrade, Gain Time) are available to
// the current player right now.
function hasNoLegalAction() {
  const player = currentPlayer()
  if (!player) return false
  const canAnyPhoto = state.market.some((tile) => canTakePhoto(tile, player))
  const canAnyUpgrade = state.market.some((tile, idx) => !!tile && canBuyUpgrade(player, idx))
  const canAnyGain = state.aboveTokens.some((n) => n > 0) || state.belowTokens.some((n) => n > 0)
  return !canAnyPhoto && !canAnyUpgrade && !canAnyGain
}

function skipTurn() {
  if (state.phase !== 'playing') return
  if (!hasNoLegalAction()) return
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

// Burned photos are skipped rather than treated as a break, so a run can
// continue across one: e.g. A A A B A with B burned still scores as A*4.
function _calcSequenceBonus(filmStrip) {
  let bonus = 0
  let runLen = 0
  let runCategory = null
  for (const photo of filmStrip) {
    if (!photo.developed) continue
    if (photo.category === runCategory) {
      runLen++
    } else {
      bonus += sequenceBonusForLength(runLen)
      runCategory = photo.category
      runLen = 1
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
  state.aboveTokens = []
  state.belowTokens = []
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
    totalPhotos,
    photoThreshold,
    canTakePhoto,
    canBuyUpgrade,
    canGainTime,
    hasNoLegalAction,
    startGame,
    takePhoto,
    buyUpgrade,
    gainTime,
    skipTurn,
    developNextPhoto,
    useDarkroom,
    skipDarkroom,
    continueDevelopment,
    resetGame,
  }
}
