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
    pass,
    developNextPhoto,
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
    ],
    () => {
      if (state.phase !== 'development') return
      if (state.players[state.development.playerIndex]?.isBot) {
        setTimeout(doDevelop, DELAY)
      }
    }
  )

  function cheapest(tiles) {
    return tiles.reduce((a, b) => (b.cost < a.cost ? b : a))
  }

  function doTurn() {
    if (state.phase !== 'playing') return
    const player = currentPlayer()
    if (!player?.isBot) return

    const photoTiles = state.market.filter((t) => canTakePhoto(t, player))
    const upgradeTiles = state.market.filter((t) => canBuyUpgrade(t, player))

    // Every affordable tile is blocked by track requirements — upgrade the track
    // that locks the most tiles to open the market back up
    if (!photoTiles.length && upgradeTiles.length) {
      const creBlocked = upgradeTiles.filter((t) => player.tracks.creativity < t.reqCreativity).length
      const eqBlocked = upgradeTiles.filter((t) => player.tracks.equipment < t.reqEquipment).length
      buyUpgrade(cheapest(upgradeTiles).id, creBlocked >= eqBlocked ? 'creativity' : 'equipment')
      return
    }

    // Early-game investment: before the first photo, build up a low track cheaply
    const totalTracks = Object.values(player.tracks).reduce((s, v) => s + v, 0)
    if (player.filmStrip.length === 0 && totalTracks < 2 && upgradeTiles.length) {
      const track =
        player.tracks.creativity <= player.tracks.equipment ? 'creativity' : 'equipment'
      buyUpgrade(cheapest(upgradeTiles).id, track)
      return
    }

    if (photoTiles.length) {
      takePhoto(pickPhoto(photoTiles, player).id)
      return
    }

    pass()
  }

  function pickPhoto(tiles, player) {
    // Extend the current same-category run for the sequence bonus
    const lastCategory = player.filmStrip[player.filmStrip.length - 1]?.category ?? null
    const sameCategory = tiles.filter((t) => t.category === lastCategory)
    if (sameCategory.length) return cheapest(sameCategory)

    // Otherwise work toward the variety bonus with an unseen category
    const owned = new Set(player.filmStrip.map((ph) => ph.category))
    if (owned.size < VARIETY_BONUS_THEMES) {
      const fresh = tiles.filter((t) => !owned.has(t.category))
      if (fresh.length) return cheapest(fresh)
    }

    return cheapest(tiles)
  }

  function doDevelop() {
    if (state.phase !== 'development') return
    const dev = state.development
    if (!state.players[dev.playerIndex]?.isBot) return

    if (!dev.playerFinished) {
      developNextPhoto()
    } else {
      continueDevelopment()
    }
  }
}
