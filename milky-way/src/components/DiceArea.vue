<script setup>
import { ref, inject, watch } from 'vue'
import { FRUIT_EMOJI, FRUIT_COLOR } from '../game.js'

const game = inject('game')
const rolling = ref(false)

watch(() => game.state.dice, () => {
  rolling.value = true
  setTimeout(() => { rolling.value = false }, 400)
})
</script>

<template>
  <div class="dice-area">
    <div v-if="!game.state.rolled" class="empty-dice">
      <span v-for="i in 6" :key="i" class="empty-die">?</span>
    </div>
    <div v-else class="dice-grid" :class="{ rolling }">
      <div
        v-for="(fruit, i) in game.state.dice"
        :key="i"
        class="die"
        :style="{ '--fruit-color': FRUIT_COLOR[fruit] }"
        :class="{ selected: game.state.selectedFruits.includes(fruit) }"
      >
        {{ FRUIT_EMOJI[fruit] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-area {
  display: flex;
  justify-content: center;
  min-height: 100px;
  align-items: center;
}

.empty-dice {
  display: flex;
  gap: 8px;
}

.empty-die {
  width: 52px;
  height: 52px;
  background: var(--card-bg);
  border: 2px dashed var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--dim);
}

.dice-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.dice-grid.rolling .die {
  animation: shake 0.4s ease;
}

.die {
  width: 56px;
  height: 56px;
  background: var(--card-bg);
  border: 2px solid color-mix(in srgb, var(--fruit-color) 40%, var(--border));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
  position: relative;
}

.die.selected {
  border-color: var(--fruit-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--fruit-color) 50%, transparent);
  transform: scale(1.06);
}

@keyframes shake {
  0%   { transform: rotate(0deg) scale(1); }
  20%  { transform: rotate(-12deg) scale(0.9); }
  40%  { transform: rotate(12deg) scale(1.1); }
  60%  { transform: rotate(-8deg) scale(0.95); }
  80%  { transform: rotate(8deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}
</style>
