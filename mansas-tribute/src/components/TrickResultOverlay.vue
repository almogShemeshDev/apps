<template>
  <div class="overlay">
    <div class="card">
      <div class="winner">
        🏆 {{ players[result.winnerIndex].name }} wins the trick!
      </div>
      <div class="sub">Leads the next round</div>

      <div v-if="result.losers.length && dicePool.length" class="picking-order">
        <div class="label">Dice picking order:</div>
        <div v-for="(pi, i) in result.losers" :key="pi" class="entry">
          {{ i + 2 }}. {{ players[pi].name }}
        </div>
      </div>

      <button class="btn" @click="$emit('continue')">
        {{ dicePool.length ? 'Pick Dice →' : 'Next Round →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameState } from '../composables/useGameState.js'

const props = defineProps({
  result: { type: Object, required: true },
  players: { type: Array, required: true },
})
defineEmits(['continue'])

const { state } = useGameState()
const dicePool = computed(() => state.dicePool)
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.card {
  background: #241a0a;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 280px;
}

.winner {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--gold);
  text-align: center;
}

.sub {
  font-size: 0.82rem;
  color: var(--text-dim);
}

.picking-order {
  margin-top: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-dim);
    margin-bottom: 4px;
  }

  .entry {
    font-size: 0.9rem;
    color: var(--text);
  }
}

.btn {
  margin-top: 12px;
  background: var(--gold);
  color: #1a1208;
  border: none;
  padding: 11px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: var(--gold-light); }
}
</style>
