import { watch } from 'vue'
import { useGameState } from './useGameState.js'
import { VARIETY_BONUS_THEMES } from '../constants.js'

const DELAY = 900

export function useBotAI() {
  const {
    state,
    currentPlayer,
    canTakePhoto,
    canBuyUpgrade,
    takePhoto,
    buyUpgrade,
    collectTime,
    developNextPhoto,
    useDarkroom,
    continueDevelopment,
  } = useGameState()

  watch(
    () => [state.phase, state.currentPlayerIndex],
    () => {
      if (state.phase === 'playing' && currentPlayer()?.isBot) {
        setTimeout(doTurn, DELAY)
      }
    }
  )

  watch(
    () => [
      state.phase,
      state.development?.playerIndex,
      state.development?.photoIndex,
      state.development?.playerFinished,
      state.development?.awaitingDarkroomChoice,
    ],
    () => {
      if (state.phase !== 'development') return
      if (state.players[state.development.playerIndex]?.isBot) {
        setTimeout(doDevelop, DELAY)
      }
    }
  )

  function cheapestSlot(slots) {
    return slots.reduce((a, b) => (b.tile.cost < a.tile.cost ? b : a))
  }

  function nearestSlot(slots) {
    return slots.reduce((a, b) => (b.idx < a.idx ? b : a))
  }

  function richestPosition() {
    let best = 0
    for (let i = 1; i < state.marketTokens.length; i++) {
      if (state.marketTokens[i] > state.marketTokens[best]) best = i
    }
    return best
  }

  function doTurn() {
    if (state.phase !== 'playing') return
    const player = currentPlayer()
    if (!player?.isBot) return

    const slots = state.market
      .map((tile, idx) => ({ tile, idx }))
      .filter(({ tile }) => tile)

    const photoSlots = slots.filter(({ tile }) => canTakePhoto(tile, player))
    const upgradeSlots = slots.filter(({ idx }) => canBuyUpgrade(player, idx))

    const richestIdx = richestPosition()
    const richestTokens = state.marketTokens[richestIdx]

    // Running low on time: collect a worthwhile pile before it strands the player
    if (player.time <= 1 && richestTokens >= 2) {
      collectTime(richestIdx)
      return
    }

    // Every affordable tile is blocked by track requirements — upgrade the track
    // that locks the most tiles to open the market back up
    if (!photoSlots.length && upgradeSlots.length) {
      const creBlocked = slots.filter((s) => player.tracks.creativity < s.tile.reqCreativity).length
      const eqBlocked = slots.filter((s) => player.tracks.equipment < s.tile.reqEquipment).length
      buyUpgrade(nearestSlot(upgradeSlots).idx, creBlocked >= eqBlocked ? 'creativity' : 'equipment')
      return
    }

    // Early-game investment: before the first photo, build up a low track cheaply
    const totalTracks = Object.values(player.tracks).reduce((s, v) => s + v, 0)
    if (player.filmStrip.length === 0 && totalTracks < 2 && upgradeSlots.length) {
      const track =
        player.tracks.creativity <= player.tracks.equipment ? 'creativity' : 'equipment'
      buyUpgrade(nearestSlot(upgradeSlots).idx, track)
      return
    }

    // Risk management: falling behind on black-cube insurance, catch up with Darkroom
    if (upgradeSlots.length && player.bag.black - player.tracks.darkroom >= 2) {
      buyUpgrade(nearestSlot(upgradeSlots).idx, 'darkroom')
      return
    }

    // Engine building: periodically convert progress into bonus white cubes via Development
    if (upgradeSlots.length && player.tracks.development < Math.floor(player.filmStrip.length / 3)) {
      buyUpgrade(nearestSlot(upgradeSlots).idx, 'development')
      return
    }

    if (photoSlots.length) {
      takePhoto(pickPhoto(photoSlots, player).idx)
      return
    }

    collectTime(richestIdx)
  }

  function pickPhoto(slots, player) {
    // Extend the current same-category run for the sequence bonus
    const lastCategory = player.filmStrip[player.filmStrip.length - 1]?.category ?? null
    const sameCategory = slots.filter((s) => s.tile.category === lastCategory)
    if (sameCategory.length) return cheapestSlot(sameCategory)

    // Otherwise work toward the variety bonus with an unseen category
    const owned = new Set(player.filmStrip.map((ph) => ph.category))
    if (owned.size < VARIETY_BONUS_THEMES) {
      const fresh = slots.filter((s) => !owned.has(s.tile.category))
      if (fresh.length) return cheapestSlot(fresh)
    }

    return cheapestSlot(slots)
  }

  function doDevelop() {
    if (state.phase !== 'development') return
    const dev = state.development
    if (!state.players[dev.playerIndex]?.isBot) return

    if (dev.awaitingDarkroomChoice) {
      useDarkroom()
    } else if (!dev.playerFinished) {
      developNextPhoto()
    } else {
      continueDevelopment()
    }
  }
}
