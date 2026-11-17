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
  equipmentDieIndex: 0,
  creativityDieIndex: 0,
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

function _rollDie() {
  return Math.floor(Math.random() * MARKET_SIZE)
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
  state.equipmentDieIndex = _rollDie()
  state.creativityDieIndex = _rollDie()
  state.drawPile = deck
  state.currentPlayerIndex = Math.floor(Math.random() * playerInputs.length)
  state.roundStartPlayerIndex = state.currentPlayerIndex
  state.endPending = false
  state.development = null
  state.scores = []
  state.phase = 'playing'
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

// A die sitting on idx only rerolls once a Photograph is taken from that
// position (not an Upgrade) and the market has refilled.
function _rerollDieIfPresentAt(idx) {
  if (idx === state.equipmentDieIndex) state.equipmentDieIndex = _rollDie()
  if (idx === state.creativityDieIndex) state.creativityDieIndex = _rollDie()
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

// The Equipment/Creativity dice each sit above one market position and add
// +1 to that photo requirement there; they affect Photograph only.
function effectiveRequirement(tile, idx) {
  return {
    creativity: tile.reqCreativity + (idx === state.creativityDieIndex ? 1 : 0),
    equipment: tile.reqEquipment + (idx === state.equipmentDieIndex ? 1 : 0),
  }
}

function canTakePhoto(tile, player, idx) {
  if (!tile) return false
  const req = effectiveRequirement(tile, idx)
  return (
    player.time >= tile.cost &&
    player.tracks.creativity >= req.creativity &&
    player.tracks.equipment >= req.equipment
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
  if (!tile || !canTakePhoto(tile, player, idx)) return

  // Pay the full cost into the pile above this position.
  player.time -= tile.cost
  state.aboveTokens[idx] += tile.cost

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
  _rerollDieIfPresentAt(idx)

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

  player.time -= cost
  // Paid tokens pile up below the market, starting from the leftmost position.
  for (let i = 0; i < cost; i++) state.belowTokens[MARKET_SIZE - 1 - i] += 1
  player.tracks[track]++

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
  const canAnyPhoto = state.market.some((tile, idx) => canTakePhoto(tile, player, idx))
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
  state.aboveTokens = []
  state.belowTokens = []
  state.equipmentDieIndex = 0
  state.creativityDieIndex = 0
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
