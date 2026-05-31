<script setup>
import { inject } from 'vue'
import { FRUITS, FRUIT_EMOJI } from '../game.js'

const game = inject('game')
</script>

<template>
  <div class="scores">
    <div class="scores-header">Scores</div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th
            v-for="(p, i) in game.state.players"
            :key="p.name"
            :class="{ active: i === game.state.activePlayerIdx }"
          >
            {{ p.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fruit in FRUITS" :key="fruit">
          <td class="fruit-cell">{{ FRUIT_EMOJI[fruit] }}</td>
          <td
            v-for="(p, i) in game.state.players"
            :key="p.name"
            class="score-cell"
            :class="{
              'is-active': i === game.state.activePlayerIdx,
              'nonzero': p.fruits[fruit] > 0,
            }"
          >
            {{ p.fruits[fruit] || '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.scores {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.scores-header {
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  padding: 8px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--dim);
  text-align: center;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

th.active {
  color: var(--gold);
}

td {
  padding: 7px 10px;
  text-align: center;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
}
tr:last-child td { border-bottom: none; }

.fruit-cell { font-size: 1.1rem; text-align: left; padding-left: 12px; }

.score-cell {
  color: var(--dim);
  font-size: 0.85rem;
}

.score-cell.nonzero {
  color: var(--text);
  font-weight: 600;
}

.score-cell.is-active.nonzero {
  color: var(--gold);
}
</style>
