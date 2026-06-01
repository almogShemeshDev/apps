<script setup>
import { inject, computed } from 'vue'
import { FRUITS, FRUIT_EMOJI, FRUIT_COLOR } from '../game.js'

const game = inject('game')

const committed = computed(() => game.state.committedFruits)
const isCommitted = computed(() => committed.value.length > 0)

const fruitOptions = computed(() =>
  FRUITS.map(fruit => {
    const count = game.diceGroups.value[fruit] || 0
    const selected = game.state.selectedFruits.includes(fruit)
    const lockedOut = isCommitted.value && !committed.value.includes(fruit)
    return { fruit, count, selected, lockedOut }
  })
)

const savedEntries = computed(() =>
  FRUITS
    .map(f => ({ fruit: f, count: game.state.savedFruitCounts[f] }))
    .filter(e => e.count > 0)
)

const nonSelectedCount = computed(() => game.nonSelectedDiceCount.value)
</script>

<template>
  <div class="fruit-selector">
    <!-- Saved dice from previous continues -->
    <div class="saved-banner" v-if="savedEntries.length > 0">
      <span class="sb-label">Saved</span>
      <span class="sb-fruits">
        <span v-for="e in savedEntries" :key="e.fruit" class="sb-entry">
          {{ FRUIT_EMOJI[e.fruit] }}×{{ e.count }}
        </span>
      </span>
    </div>

    <!-- Commitment banner -->
    <div class="commit-banner" v-if="isCommitted">
      <span class="cb-label">Locked to</span>
      <span class="cb-fruits">
        <span v-for="f in committed" :key="f">{{ FRUIT_EMOJI[f] }}</span>
      </span>
      <span class="cb-note">only these types allowed</span>
    </div>

    <div class="selector-label" v-if="!game.mustStop.value">
      Select fruit type to keep
    </div>

    <div class="must-stop-alert" v-if="game.mustStop.value">
      None of your locked fruits appeared — opponents gain the dice results and you may pass your turn.
    </div>

    <div class="fruits" v-if="!game.mustStop.value">
      <button
        v-for="opt in fruitOptions"
        :key="opt.fruit"
        class="fruit-btn"
        :class="{
          selected: opt.selected,
          empty: !opt.count,
          'locked-out': opt.lockedOut,
        }"
        :style="opt.count && !opt.lockedOut ? { '--fc': FRUIT_COLOR[opt.fruit] } : {}"
        :disabled="!opt.count || opt.lockedOut"
        @click="game.toggleFruit(opt.fruit)"
      >
        <span class="emoji">{{ FRUIT_EMOJI[opt.fruit] }}</span>
        <span class="count">×{{ opt.count }}</span>
        <span v-if="opt.selected" class="check">✓</span>
        <span v-if="opt.lockedOut" class="lock">🔒</span>
      </button>
    </div>

    <div class="discard-info" v-if="nonSelectedCount > 0 && game.state.rolled && !game.mustStop.value">
      <span class="di-label">Others receive if you stop:</span>
      <span class="di-count">{{ nonSelectedCount }} dice</span>
    </div>
  </div>
</template>

<style scoped>
.fruit-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-label {
  font-size: 0.85rem;
  color: var(--dim);
}

.fruits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fruit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--card-bg);
  border: 2px solid var(--border);
  color: var(--text);
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.15s;
  position: relative;
}

.fruit-btn:not(.empty):not(.locked-out):hover {
  border-color: color-mix(in srgb, var(--fc) 60%, var(--border));
}

.fruit-btn.selected {
  border-color: var(--fc);
  background: color-mix(in srgb, var(--fc) 15%, var(--card-bg));
  box-shadow: 0 0 8px color-mix(in srgb, var(--fc) 30%, transparent);
}

.fruit-btn.empty {
  opacity: 0.3;
  cursor: default;
}

.fruit-btn.locked-out {
  opacity: 0.2;
  cursor: not-allowed;
  filter: grayscale(1);
}

.emoji { font-size: 1.2rem; }
.count { font-weight: 700; color: var(--text); }
.check {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--green);
  color: #000;
  font-size: 0.65rem;
  font-weight: 800;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.discard-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--red) 10%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--red) 25%, var(--border));
  border-radius: 8px;
}
.di-label { color: var(--red); font-weight: 600; }
.di-count { color: var(--dim); }

.saved-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--green) 8%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--green) 30%, var(--border));
  border-radius: 8px;
  font-size: 0.82rem;
}
.sb-label { color: var(--green); font-weight: 700; }
.sb-fruits { display: flex; gap: 6px; }
.sb-entry { font-size: 1rem; font-weight: 600; }

.commit-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--gold) 8%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--gold) 30%, var(--border));
  border-radius: 8px;
  font-size: 0.82rem;
}
.cb-label { color: var(--gold); font-weight: 700; }
.cb-fruits { font-size: 1.1rem; letter-spacing: 2px; }
.cb-note { color: var(--dim); }

.must-stop-alert {
  padding: 10px 14px;
  background: color-mix(in srgb, var(--red) 12%, var(--card-bg));
  border: 1px solid color-mix(in srgb, var(--red) 35%, var(--border));
  border-radius: 8px;
  font-size: 0.88rem;
  color: var(--red);
  font-weight: 600;
}

.lock {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 0.7rem;
}
</style>
