import { watch } from 'vue'
import { useGameState } from './useGameState.js'
import { legalCards } from './useTrickLogic.js'
import { VALUE_RANK } from '../constants/game.js'

const DELAY = 750

export function useBotAI() {
    const { state, activePlayer, getPlayer, placeInitialBid, playCard, replaceBid } = useGameState()

    function isBot(id) {
        return getPlayer(id)?.isBot === true
    }

    watch(
        () => ({
            phase: state.phase,
            bidIdx: state.biddingIndex,
            plays: state.currentTrick.plays.length,
            replacing: state.replacingBidPlayerId,
        }),
        ({ phase, replacing }) => {
            const active = activePlayer()

            if (phase === 'bidding' && active !== null && isBot(active)) {
                setTimeout(() => doBid(active), DELAY)
            }
            if (phase === 'playing' && active !== null && isBot(active)) {
                setTimeout(() => doPlay(active), DELAY)
            }
            if (phase === 'replacing-bid' && replacing !== null && isBot(replacing)) {
                setTimeout(() => doReplaceBid(replacing), DELAY)
            }
        }
    )

    function doBid(id) {
        const player = getPlayer(id)
        if (!player || state.phase !== 'bidding') return

        const hand = player.hand
        const twos = hand.filter((c) => c.value === 2)
        const trees = hand.filter((c) => c.value === 'tree')
        const ones = hand.filter((c) => c.value === 1)

        let targetValue
        if (twos.length >= 4) {
            targetValue = 2
        } else if (twos.length === 0 && trees.length >= 2) {
            targetValue = 'tree'
        } else if (twos.length <= 1) {
            targetValue = 1
        } else {
            targetValue = 2
        }

        let bidCard = hand.find((c) => c.value === targetValue)
        if (!bidCard) bidCard = ones[0] || trees[0] || twos[0] || hand[0]

        placeInitialBid(id, bidCard)
    }

    function doPlay(id) {
        const player = getPlayer(id)
        if (!player || state.phase !== 'playing') return

        const leadSuit = state.currentTrick.plays[0]?.card.suit ?? null
        const legal = legalCards(player.hand, leadSuit, player.bid)
        const wantWin = shouldWinTrick(player)

        const chosen = wantWin
            ? pickToWin(legal, state.currentTrick.plays, leadSuit, player.bid)
            : pickToLose(legal, player.bid)

        playCard(id, chosen)
    }

    function shouldWinTrick(player) {
        const bid = player.bid
        if (!bid) return true
        if (bid.value === 'tree') {
            if (player.tricksWon === 0) return false
            if (player.tricksWon < 3) return true
            return false
        }
        return player.tricksWon < bid.value
    }

    function pickToWin(legal, plays, leadSuit, bidCard) {
        const nonBid = legal.filter((c) => c.id !== bidCard?.id)
        const pool = nonBid.length ? nonBid : legal

        if (!leadSuit) {
            const twos = pool.filter((c) => c.value === 2)
            if (twos.length) return twos[0]
            return pool.reduce((best, c) =>
                VALUE_RANK[c.value] > VALUE_RANK[best.value] ? c : best
            )
        }

        const suitCards = pool.filter((c) => c.suit === leadSuit)
        const currentWinner = currentWinningCard(plays)
        const beaters = suitCards.filter(
            (c) => VALUE_RANK[c.value] > VALUE_RANK[currentWinner?.value ?? -1]
        )

        if (beaters.length) {
            return beaters.reduce((best, c) =>
                VALUE_RANK[c.value] < VALUE_RANK[best.value] ? c : best
            )
        }

        if (!suitCards.length) {
            const trees = pool.filter((c) => c.value === 'tree')
            if (trees.length) return trees[0]
        }

        return pool.reduce((best, c) => (VALUE_RANK[c.value] > VALUE_RANK[best.value] ? c : best))
    }

    function pickToLose(legal, bidCard) {
        const nonBid = legal.filter((c) => c.id !== bidCard?.id)
        const pool = nonBid.length ? nonBid : legal
        const nonTree = pool.filter((c) => c.value !== 'tree')
        const src = nonTree.length ? nonTree : pool
        return src.reduce((best, c) => (VALUE_RANK[c.value] < VALUE_RANK[best.value] ? c : best))
    }

    function currentWinningCard(plays) {
        if (!plays.length) return null
        const leadSuit = plays[0].card.suit
        const treePlays = plays.filter((p) => p.card.value === 'tree')
        if (treePlays.length === 1) return treePlays[0].card
        const suitPlays = plays.filter(
            (p) => p.card.suit === leadSuit && p.card.value !== 'tree'
        )
        if (!suitPlays.length) return plays[0].card
        return suitPlays.reduce(
            (best, p) => (VALUE_RANK[p.card.value] > VALUE_RANK[best.value] ? p.card : best),
            suitPlays[0].card
        )
    }

    function doReplaceBid(id) {
        const player = getPlayer(id)
        if (!player || !player.hand.length || state.phase !== 'replacing-bid') return

        const ones = player.hand.filter((c) => c.value === 1)
        const trees = player.hand.filter((c) => c.value === 'tree')
        const twos = player.hand.filter((c) => c.value === 2)

        const newBid = ones[0] || trees[0] || twos[0] || player.hand[0]
        replaceBid(id, newBid)
    }
}
