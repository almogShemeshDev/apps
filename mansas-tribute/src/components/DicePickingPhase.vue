<template>
  <div class="overlay">
    <div class="panel">
      <div class="title">{{ currentPicker.name }}, pick a die</div>
      <div class="sub">{{ dicePickingTurn + 1 }} of {{ losers.length }}</div>

      <div v-if="currentPicker.isBot" class="bot-thinking">
        🤖 Thinking...
      </div>
      <template v-else>
        <div class="pool">
          <DiceComponent
            v-for="die in state.dicePool"
            :key="die.id"
            :die="die"
            selectable
            @select="pickDie(die.id)"
          />
        </div>
        <button class="btn-pass" @click="passPicking">Pass</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DiceComponent from './DiceComponent.vue'
import { useGameState } from '../composables/useGameState.js'

const { state, pickDie, passPicking } = useGameState()

const losers = computed(() => state.trickResult.losers)
const dicePickingTurn = computed(() => state.dicePickingTurn)
const currentPicker = computed(() => state.players[losers.value[dicePickingTurn.value]])
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

.panel {
  background: #241a0a;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 300px;
}

.title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--gold);
}

.sub {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin-top: -8px;
}

.bot-thinking {
  font-size: 1rem;
  color: var(--text-dim);
  font-style: italic;
  padding: 8px 0;
}

.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 48px;
}

.btn-pass {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: rgba(255,255,255,0.3);
    color: var(--text);
  }
}
</style>
