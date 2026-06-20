<template>
  <div class="scoreboard">
    <h1>Game Over</h1>
    <div class="rows">
      <div
        v-for="(p, i) in sorted"
        :key="p.name"
        class="row"
        :class="{ winner: i === 0 }"
      >
        <span class="rank">{{ i + 1 }}</span>
        <span class="name">{{ p.name }}</span>
        <span class="tricks">{{ p.tricks }} trick{{ p.tricks !== 1 ? 's' : '' }}</span>
      </div>
    </div>
    <button class="btn-again" @click="$emit('playAgain')">Play Again</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ players: { type: Array, required: true } })
defineEmits(['playAgain'])

const sorted = computed(() =>
  [...props.players].sort((a, b) => b.tricks - a.tricks)
)
</script>

<style lang="scss" scoped>
.scoreboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;
}

h1 {
  font-size: 2rem;
  font-weight: 900;
  color: var(--gold);
  letter-spacing: 0.04em;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 280px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--surface);
  border: 1px solid var(--border);

  &.winner {
    border-color: var(--gold);
    background: rgba(201, 168, 76, 0.1);

    .rank { color: var(--gold); }
  }
}

.rank {
  font-weight: 800;
  font-size: 1.1rem;
  width: 24px;
  color: var(--text-dim);
}

.name {
  flex: 1;
  font-weight: 600;
}

.tricks {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.btn-again {
  background: var(--gold);
  color: #1a1208;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: var(--gold-light); }
}
</style>
