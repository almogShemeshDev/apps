<template>
  <div class="overlay">
    <div class="modal">
      <h2>You played your bid card!</h2>
      <p class="sub">Pick a new bid from your hand, <strong>{{ player.name }}</strong></p>
      <p class="hint">1 = bet 1 trick &nbsp;|&nbsp; 2 = bet 2 tricks &nbsp;|&nbsp; 🌳 = bet exactly 0 or 3 tricks</p>

      <div class="cards">
        <CardComponent
          v-for="card in player.hand"
          :key="card.id"
          :card="card"
          :selectable="true"
          :selected="selected?.id === card.id"
          @select="selected = card"
        />
      </div>

      <button class="btn-confirm" :disabled="!selected" @click="confirm">Confirm New Bid</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CardComponent from './CardComponent.vue'
import { useGameState } from '../composables/useGameState.js'

const props = defineProps({
  player: { type: Object, required: true },
})

const { replaceBid } = useGameState()
const selected = ref(null)

function confirm() {
  if (!selected.value) return
  replaceBid(props.player.id, selected.value)
  selected.value = null
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #1a3a2a;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 28px 32px;
  text-align: center;
  max-width: 560px;
  width: 90%;
  color: #e8f5e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
h2 { margin: 0; font-size: 1.3rem; }
.sub { margin: 0; font-size: 1rem; }
.hint { font-size: 0.78rem; color: rgba(255,255,255,0.45); margin: 0; }
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 100px;
  align-items: center;
}
.btn-confirm {
  background: #38a169;
  color: white;
  border: none;
  padding: 8px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-confirm:disabled { opacity: 0.4; cursor: default; }
</style>
