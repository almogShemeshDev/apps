import { reactive } from 'vue'
import { deal } from './useDeck.js'
import { resolveTrick, legalCards, isBidCorrect } from './useTrickLogic.js'
import { CARDS_PER_PLAYER } from '../constants/game.js'

const state = reactive({
  phase: 'setup', // 'setup' | 'bidding' | 'playing' | 'replacing-bid' | 'trick-resolved' | 'game-over'
  players: [],
  currentTrick: {
    leadPlayerId: null,
    plays: [],
    winnerId: null,
  },
  currentLeaderId: null,
  biddingIndex: 0,
  replacingBidPlayerId: null,
  scores: [],
})

function activePlayer() {
  if (state.phase === 'bidding') return state.players[state.biddingIndex]?.id ?? null
  if (state.phase === 'playing') {
    const playedIds = state.currentTrick.plays.map(p => p.playerId)
    const order = playerOrder(state.currentTrick.leadPlayerId)
    return order.find(id => !playedIds.includes(id)) ?? null
  }
  return null
}

function playerOrder(leadId) {
  const ids = state.players.map(p => p.id)
  const start = ids.indexOf(leadId)
  return [...ids.slice(start), ...ids.slice(0, start)]
}

function getPlayer(id) {
  return state.players.find(p => p.id === id)
}

function startGame(players) {
  const hands = deal(players.length, CARDS_PER_PLAYER[players.length])
  state.players = players.map(({ name, isBot }, i) => ({
    id: i,
    name,
    isBot: !!isBot,
    hand: hands[i],
    bid: null,
    tricksWon: 0,
  }))
  state.currentTrick = { leadPlayerId: 0, plays: [], winnerId: null }
  state.currentLeaderId = 0
  state.biddingIndex = 0
  state.scores = []
  state.phase = 'bidding'
}

function placeInitialBid(playerId, card) {
  if (state.phase !== 'bidding') return
  if (state.players[state.biddingIndex]?.id !== playerId) return

  const player = getPlayer(playerId)
  if (!player.hand.find(c => c.id === card.id)) return

  player.bid = card
  player.hand = player.hand.filter(c => c.id !== card.id)
  state.biddingIndex++

  if (state.biddingIndex >= state.players.length) {
    state.phase = 'playing'
  }
}

function playCard(playerId, card) {
  if (state.phase !== 'playing') return
  if (activePlayer() !== playerId) return

  const player = getPlayer(playerId)
  const isBidCard = player.bid?.id === card.id
  const isHandCard = !!player.hand.find(c => c.id === card.id)
  if (!isBidCard && !isHandCard) return

  const leadSuit = state.currentTrick.plays[0]?.card.suit ?? null
  const legal = legalCards(player.hand, leadSuit, player.bid)
  if (!legal.find(c => c.id === card.id)) return

  if (isBidCard) {
    player.bid = null
    state.currentTrick.plays.push({ playerId, card })
    if (player.hand.length > 0) {
      state.phase = 'replacing-bid'
      state.replacingBidPlayerId = playerId
      return
    }
  } else {
    player.hand = player.hand.filter(c => c.id !== card.id)
    state.currentTrick.plays.push({ playerId, card })
  }

  if (state.currentTrick.plays.length === state.players.length) {
    _resolveTrick()
  }
}

function replaceBid(playerId, card) {
  if (state.phase !== 'replacing-bid') return
  if (state.replacingBidPlayerId !== playerId) return

  const player = getPlayer(playerId)
  if (!player.hand.find(c => c.id === card.id)) return

  player.bid = card
  player.hand = player.hand.filter(c => c.id !== card.id)
  state.replacingBidPlayerId = null
  state.phase = 'playing'

  if (state.currentTrick.plays.length === state.players.length) {
    _resolveTrick()
  }
}

function _resolveTrick() {
  const winnerId = resolveTrick(state.currentTrick.plays)
  state.currentTrick.winnerId = winnerId
  getPlayer(winnerId).tricksWon++
  state.phase = 'trick-resolved'
}

function nextTrick() {
  if (state.phase !== 'trick-resolved') return
  const winnerId = state.currentTrick.winnerId
  state.currentLeaderId = winnerId
  state.currentTrick = { leadPlayerId: winnerId, plays: [], winnerId: null }

  // Game ends when all hand cards are played — bid cards remain permanently
  const anyHandCardsLeft = state.players.some(p => p.hand.length > 0)
  if (anyHandCardsLeft) {
    state.phase = 'playing'
  } else {
    _calcScores()
    state.phase = 'game-over'
  }
}

function _calcScores() {
  state.scores = state.players.map(p => {
    const tricks = p.tricksWon
    const bonus = isBidCorrect(p.bid, tricks) ? 5 : 0
    return { playerId: p.id, name: p.name, tricks, bid: p.bid, bonus, total: tricks + bonus }
  })
}

function resetGame() {
  state.phase = 'setup'
  state.players = []
  state.currentTrick = { leadPlayerId: null, plays: [], winnerId: null }
  state.currentLeaderId = null
  state.biddingIndex = 0
  state.replacingBidPlayerId = null
  state.scores = []
}

export function useGameState() {
  return {
    state,
    activePlayer,
    getPlayer,
    legalCards,
    startGame,
    placeInitialBid,
    playCard,
    replaceBid,
    nextTrick,
    resetGame,
  }
}
