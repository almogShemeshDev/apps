import { watch } from 'vue'
import { useGameState } from './useGameState.js'
import { VARIETY_BONUS_THEMES, UPGRADE_TRACK_BY_INDEX } from '../constants.js'

const DELAY = 900

export function useBotAI() {
  const {
    state,
    currentPlayer,
    canTakePhoto,
    canBuyUpgrade,
    takePhoto,
    buyUpgrade,
    gainTime,
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

  // Best Gain Time option across both the above- and below-position piles.
  function richestGain() {
    let best = { pile: 'above', idx: 0, amount: state.aboveTokens[0] }
    for (let i = 0; i < state.aboveTokens.length; i++) {
      if (state.aboveTokens[i] > best.amount) best = { pile: 'above', idx: i, amount: state.aboveTokens[i] }
    }
    for (let i = 0; i < state.belowTokens.length; i++) {
      if (state.belowTokens[i] > best.amount) best = { pile: 'below', idx: i, amount: state.belowTokens[i] }
    }
    return best
  }

  // Among slots the bot can afford to upgrade, find one whose market position
  // raises the desired track (position determines the track, not player choice).
  function upgradeSlotFor(upgradeSlots, track) {
    const matching = upgradeSlots.filter((s) => UPGRADE_TRACK_BY_INDEX[s.idx] === track)
    return matching.length ? nearestSlot(matching) : null
  }

  function doTurn() {
    if (state.phase !== 'playing') return
    const player = currentPlayer()
    if (!player?.isBot) return

    const slots = state.market
      .map((tile, idx) => ({ tile, idx }))
      .filter(({ tile }) => tile)

    const photoSlots = slots.filter(({ tile, idx }) => canTakePhoto(tile, player, idx))
    const upgradeSlots = slots.filter(({ idx }) => canBuyUpgrade(player, idx))

    const richest = richestGain()

    // Running low on time: collect a worthwhile pile before it strands the player
    if (player.time <= 1 && richest.amount >= 2) {
      gainTime(richest.pile, richest.idx)
      return
    }

    // Every affordable tile is blocked by track requirements — upgrade the track
    // that locks the most tiles to open the market back up, if such a slot exists
    if (!photoSlots.length && upgradeSlots.length) {
      const creBlocked = slots.filter((s) => player.tracks.creativity < s.tile.reqCreativity).length
      const eqBlocked = slots.filter((s) => player.tracks.equipment < s.tile.reqEquipment).length
      const slot = upgradeSlotFor(upgradeSlots, creBlocked >= eqBlocked ? 'creativity' : 'equipment')
        ?? upgradeSlotFor(upgradeSlots, creBlocked >= eqBlocked ? 'equipment' : 'creativity')
      if (slot) {
        buyUpgrade(slot.idx)
        return
      }
    }

    // Early-game investment: before the first photo, build up a low track cheaply
    const totalTracks = Object.values(player.tracks).reduce((s, v) => s + v, 0)
    if (player.filmStrip.length === 0 && totalTracks < 2 && upgradeSlots.length) {
      const preferred = player.tracks.creativity <= player.tracks.equipment ? 'creativity' : 'equipment'
      const slot = upgradeSlotFor(upgradeSlots, preferred) ?? upgradeSlotFor(upgradeSlots, 'equipment') ?? upgradeSlotFor(upgradeSlots, 'creativity')
      if (slot) {
        buyUpgrade(slot.idx)
        return
      }
    }

    // Risk management: falling behind on black-cube insurance, catch up with Darkroom
    if (upgradeSlots.length && player.bag.black - player.tracks.darkroom >= 2) {
      const slot = upgradeSlotFor(upgradeSlots, 'darkroom')
      if (slot) {
        buyUpgrade(slot.idx)
        return
      }
    }

    // Engine building: periodically convert progress into bonus white cubes via Development
    if (upgradeSlots.length && player.tracks.development < Math.floor(player.filmStrip.length / 3)) {
      const slot = upgradeSlotFor(upgradeSlots, 'development')
      if (slot) {
        buyUpgrade(slot.idx)
        return
      }
    }

    if (photoSlots.length) {
      takePhoto(pickPhoto(photoSlots, player).idx)
      return
    }

    if (upgradeSlots.length) {
      buyUpgrade(nearestSlot(upgradeSlots).idx)
      return
    }

    gainTime(richest.pile, richest.idx)
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
