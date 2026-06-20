<template>
  <div class="scoreboard">
    <h1>Game Over</h1>
    <div class="scoreboard-table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Tricks</th>
          <th>Bid</th>
          <th>Bonus</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in scores" :key="row.playerId" :class="{ winner: row.total === maxScore }">
          <td>{{ row.name }}</td>
          <td>{{ row.tricks }}</td>
          <td>{{ bidLabel(row.bid) }}</td>
          <td>{{ row.bonus > 0 ? '+5' : '—' }}</td>
          <td class="total">{{ row.total }}</td>
        </tr>
      </tbody>
    </table>
    </div>
    <p class="winner-msg">🏆 {{ winner?.name }} wins!</p>
    <button class="btn-play-again" @click="$emit('playAgain')">Play Again</button>
    <p class="credits">© 2026 Almog Shemesh · Game Design &amp; Concept · All rights reserved</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  scores: { type: Array, required: true },
})
defineEmits(['playAgain'])

const maxScore = computed(() => Math.max(...props.scores.map(s => s.total)))
const winner = computed(() => props.scores.find(s => s.total === maxScore.value))

function bidLabel(card) {
  if (!card) return 'None'
  if (card.value === 'tree') return '🌳 (0 or 3)'
  return card.value
}
</script>

<style scoped>
.scoreboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;
  color: #e8f5e9;
}

.scoreboard-table-wrapper {
  overflow: auto;
}

h1 {
  font-size: 2rem;
  margin: 0;
}
table {
  border-collapse: collapse;
  width: fit-content;
}
th, td {
  padding: 10px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  white-space: nowrap;
}
th {
  color: #a0aec0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
tr.winner td {
  color: #f6e05e;
  font-weight: 700;
}
.total {
  font-size: 1.1rem;
  font-weight: 700;
}
.winner-msg {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f6e05e;
  margin: 0;
}
.btn-play-again {
  background: #38a169;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-play-again:hover {
  background: #2f855a;
}
.credits {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.03em;
  margin-top: 8px;
}
</style>
