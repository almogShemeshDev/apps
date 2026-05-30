<script setup>
import { inject } from 'vue'
import { FRUITS, FRUIT_EMOJI } from '../game.js'

const game = inject('game')
</script>

<template>
  <div class="scoreboard">
    <div class="title-area">
      <div class="trophy">🏆</div>
      <h1>Game Over</h1>
      <div class="winner-banner" v-if="game.overallWinner.value">
        <span class="winner-label">Winner</span>
        <span class="winner-name">{{ game.overallWinner.value }}</span>
        <span class="winner-sub">{{ game.playerMajorities.value[game.overallWinner.value] }} project{{ game.playerMajorities.value[game.overallWinner.value] !== 1 ? 's' : '' }} won</span>
      </div>
      <div class="winner-banner tie" v-else>
        <span class="winner-label">Result</span>
        <span class="winner-name">Tie!</span>
        <span class="winner-sub">Multiple players share the top spot</span>
      </div>
    </div>

    <div class="results-panel">
      <table class="results-table">
        <thead>
          <tr>
            <th class="fruit-th">Fruit</th>
            <th
              v-for="p in game.state.players"
              :key="p.name"
              :class="{ 'overall-winner': p.name === game.overallWinner.value }"
            >
              <div class="th-name">{{ p.name }}</div>
              <div class="th-majorities">
                {{ game.playerMajorities.value[p.name] }}
                <span class="maj-label">won</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fruit in FRUITS" :key="fruit">
            <td class="fruit-td">{{ FRUIT_EMOJI[fruit] }} {{ fruit }}</td>
            <td
              v-for="p in game.state.players"
              :key="p.name"
              class="score-td"
              :class="{
                'fruit-winner': game.fruitWinners.value[fruit] === p.name,
                'overall-winner': p.name === game.overallWinner.value,
              }"
            >
              <span class="score-val">{{ p.fruits[fruit] }}</span>
              <span v-if="game.fruitWinners.value[fruit] === p.name" class="crown">👑</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="majority-summary">
      <div
        v-for="p in game.state.players"
        :key="p.name"
        class="player-summary"
        :class="{ winner: p.name === game.overallWinner.value }"
      >
        <span class="ps-name">{{ p.name }}</span>
        <span class="ps-count">{{ game.playerMajorities.value[p.name] }} / 5 fruits</span>
      </div>
    </div>

    <button class="btn-again" @click="game.resetGame()">
      Play Again 🌌
    </button>
  </div>
</template>

<style scoped>
.scoreboard {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title-area {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.trophy { font-size: 3.5rem; }

h1 {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa, #ffd700, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.winner-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(255,199,0,0.1), rgba(255,199,0,0.05));
  border: 1px solid rgba(255,199,0,0.3);
  border-radius: 16px;
  padding: 16px 32px;
}

.winner-banner.tie {
  background: linear-gradient(135deg, rgba(100,100,255,0.1), rgba(100,100,255,0.05));
  border-color: rgba(100,100,255,0.3);
}

.winner-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--dim);
}

.winner-name {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gold);
}

.winner-sub {
  font-size: 0.85rem;
  color: var(--dim);
}

.results-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  padding: 14px 12px;
  text-align: center;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.th-name {
  font-weight: 700;
  color: var(--text);
  font-size: 0.95rem;
}

.th-majorities {
  margin-top: 2px;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--dim);
}

.maj-label { font-size: 0.7rem; }

.fruit-th {
  text-align: left;
  padding-left: 16px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--dim);
}

.results-table th.overall-winner .th-name { color: var(--gold); }

.fruit-td {
  padding: 12px 16px;
  font-size: 0.9rem;
  color: var(--dim);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  white-space: nowrap;
}

.score-td {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  font-size: 1rem;
  font-weight: 600;
  color: var(--dim);
  position: relative;
}

.score-td.fruit-winner {
  color: var(--gold);
  background: color-mix(in srgb, var(--gold) 8%, transparent);
}

.score-td.overall-winner { background: color-mix(in srgb, var(--gold) 5%, transparent); }

.score-val { margin-right: 2px; }
.crown { font-size: 0.9rem; }

tr:last-child .fruit-td,
tr:last-child .score-td { border-bottom: none; }

.majority-summary {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.player-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.player-summary.winner {
  border-color: var(--gold);
  background: color-mix(in srgb, var(--gold) 8%, var(--surface));
}

.ps-name { font-weight: 700; font-size: 0.95rem; }
.ps-count { font-size: 0.82rem; color: var(--dim); }
.player-summary.winner .ps-name { color: var(--gold); }

.btn-again {
  background: linear-gradient(135deg, #4a7aff, #7c3aed);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 14px 32px;
  border-radius: 12px;
  align-self: center;
}
</style>
