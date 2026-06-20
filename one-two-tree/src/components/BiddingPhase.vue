<template>
  <div class="bidding-phase">
    <h1 class="title">🌳 One-Two-Tree</h1>

    <div class="panel">
      <p class="prompt">
        <strong>{{ currentPlayer.name }}</strong>, pick your bid card
      </p>
      <p class="hint">
        1 = bet exactly 1 trick &nbsp;|&nbsp; 2 = bet exactly 2 tricks &nbsp;|&nbsp; 🌳 = bet exactly 0 or 3 tricks
      </p>
      <p class="progress">Player {{ state.biddingIndex + 1 }} of {{ state.players.length }}</p>

      <div v-if="currentPlayer.isBot" class="bot-thinking">
        🤖 Thinking...
      </div>
      <template v-else>
        <div class="cards">
          <CardComponent
            v-for="card in currentPlayer.hand"
            :key="card.id"
            :card="card"
            :selectable="true"
            :selected="selected?.id === card.id"
            @select="selected = card"
          />
        </div>
        <button class="btn-confirm" :disabled="!selected" @click="confirm">
          Confirm Bid
        </button>
      </template>
    </div>

    <footer class="credits">© 2026 Almog Shemesh · Game Design &amp; Concept · All rights reserved</footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CardComponent from './CardComponent.vue'
import { useGameState } from '../composables/useGameState.js'

const { state, placeInitialBid } = useGameState()

const selected = ref(null)

const currentPlayer = computed(() => state.players[state.biddingIndex])

function confirm() {
  if (!selected.value) return
  placeInitialBid(currentPlayer.value.id, selected.value)
  selected.value = null
}
</script>

<style scoped>
.bidding-phase {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 40px 20px;
  background: #1a4731;
  color: #e8f5e9;
}
.title {
  font-size: 2.4rem;
  font-weight: 900;
  margin: 0;
}
.panel {
  background: rgba(0,0,0,0.25);
  border-radius: 16px;
  padding: 32px;
  max-width: 640px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.prompt {
  font-size: 1.2rem;
  margin: 0;
}
.hint {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
  text-align: center;
}
.progress {
  font-size: 0.8rem;
  color: #a0aec0;
  margin: 0;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.btn-confirm {
  margin-top: 8px;
  background: #38a169;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-confirm:disabled {
  opacity: 0.4;
  cursor: default;
}
.bot-thinking {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.6);
  padding: 24px 0;
  letter-spacing: 0.03em;
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
