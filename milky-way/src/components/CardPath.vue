<script setup>
import { inject } from 'vue'
import { CARDS } from '../game.js'

const game = inject('game')
</script>

<template>
  <div class="card-path">
    <template v-for="(c, i) in CARDS" :key="c.id">
      <div
        class="path-card"
        :class="{
          past: i < game.state.cardIdx,
          current: i === game.state.cardIdx,
          future: i > game.state.cardIdx,
        }"
      >
        <div class="card-num">{{ c.id }}</div>
        <div class="card-stats">
          <span class="keep">↑{{ c.keep }}</span>
          <span class="discard" v-if="c.discard > 0">↓{{ c.discard }}</span>
          <span class="discard all" v-else>all</span>
        </div>
      </div>
      <div v-if="i < 5" class="arrow" :class="{ dim: i >= game.state.cardIdx }">›</div>
    </template>
  </div>
</template>

<style scoped>
.card-path {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  padding: 4px 0;
}

.path-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 2px solid transparent;
  min-width: 54px;
  transition: all 0.2s;
}

.path-card.past {
  background: var(--card-bg);
  border-color: var(--border);
  opacity: 0.45;
}

.path-card.current {
  background: linear-gradient(135deg, #1a1a60, #2a2a80);
  border-color: var(--gold);
  box-shadow: 0 0 12px rgba(255, 199, 0, 0.3);
}

.path-card.future {
  background: var(--card-bg);
  border-color: var(--border);
  opacity: 0.6;
}

.card-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
}

.path-card.current .card-num { color: var(--gold); }
.path-card.past .card-num { color: var(--dim); }

.card-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 0.7rem;
  font-weight: 600;
}

.keep { color: var(--green); }
.discard { color: var(--red); }
.discard.all { color: var(--green); }

.arrow {
  color: var(--gold);
  font-size: 1.4rem;
  flex-shrink: 0;
  opacity: 0.7;
}
.arrow.dim { opacity: 0.25; }
</style>
