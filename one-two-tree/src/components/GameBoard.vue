<template>
  <div class="game-board">
    <div class="opponents">
      <PlayerHand
        v-for="player in opponents"
        :key="player.id"
        :player="player"
        :isActive="activePlayer() === player.id && !player.isBot"
        :isBot="player.isBot"
        :isTurn="activePlayer() === player.id"
        :leadSuit="leadSuit"
        @play="card => playCard(player.id, card)"
      />
    </div>

    <div class="center">
      <TrickArea :trick="state.currentTrick" />
    </div>

    <PlayerHand
      :player="state.players[0]"
      :isActive="activePlayer() === 0"
      :leadSuit="leadSuit"
      @play="card => playCard(0, card)"
    />

    <!-- Replace bid modal (only for human player) -->
    <ReplaceBidModal
      v-if="state.phase === 'replacing-bid' && !getPlayer(state.replacingBidPlayerId)?.isBot"
      :player="getPlayer(state.replacingBidPlayerId)"
    />

    <!-- Trick resolved overlay -->
    <div v-if="state.phase === 'trick-resolved'" class="overlay">
      <div class="trick-result">
        <p class="winner-name">{{ t('wonTrick', getPlayer(state.currentTrick.winnerId)?.name) }}</p>
        <button class="btn-next" @click="nextTrick">{{ t('nextTrick') }}</button>
      </div>
    </div>

    <button class="btn-new-game" @click="confirmNewGame">{{ t('newGame') }}</button>
    <footer class="credits">© 2026 Almog Shemesh · Game Design &amp; Concept · All rights reserved</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerHand from './PlayerHand.vue'
import TrickArea from './TrickArea.vue'
import ReplaceBidModal from './ReplaceBidModal.vue'
import { useGameState } from '../composables/useGameState.js'
import { useLang } from '../composables/useLang.js'

const { state, activePlayer, getPlayer, playCard, nextTrick, resetGame } = useGameState()
const { t } = useLang()

const opponents = computed(() => state.players.filter(p => p.id !== 0))
const leadSuit = computed(() => state.currentTrick.plays[0]?.card.suit ?? null)

function confirmNewGame() {
  if (window.confirm(t('confirmNewGame'))) {
    resetGame()
  }
}
</script>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: #1a4731;
}
.opponents {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.trick-result {
  background: #1a3a2a;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 32px 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.winner-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f6e05e;
  margin: 0;
}
.btn-next {
  background: #38a169;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-new-game {
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(0,0,0,0.35);
  color: #e8f5e9;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 50;
}
.btn-new-game:hover {
  background: rgba(220,53,69,0.6);
  border-color: transparent;
}
.credits {
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.2);
  pointer-events: none;
  letter-spacing: 0.03em;
}
</style>
