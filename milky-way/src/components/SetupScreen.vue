<script setup>
import { ref, computed, inject } from 'vue'

const game = inject('game')
const names = ref(['', ''])

const canStart = computed(() => names.value.filter(n => n.trim()).length >= 2)

function addPlayer() {
  if (names.value.length < 4) names.value.push('')
}
function removePlayer() {
  if (names.value.length > 2) names.value.pop()
}
function start() {
  const valid = names.value.filter(n => n.trim())
  if (valid.length >= 2) game.startGame(valid)
}
</script>

<template>
  <div class="setup">
    <div class="title-area">
      <div class="stars">✦ ✧ ✦ ✧ ✦</div>
      <h1>🌌 Milky Way</h1>
      <p class="subtitle">Push Your Luck · Fruit Collection · Dice Game</p>
    </div>

    <div class="panel">
      <h2>Players</h2>
      <div class="inputs">
        <div v-for="(_, i) in names" :key="i" class="input-row">
          <span class="player-num">P{{ i + 1 }}</span>
          <input
            v-model="names[i]"
            :placeholder="`Player ${i + 1}`"
            @keyup.enter="start"
            maxlength="20"
          />
        </div>
      </div>
      <div class="player-controls">
        <button v-if="names.length < 4" class="btn-ghost" @click="addPlayer">+ Add Player</button>
        <button v-if="names.length > 2" class="btn-ghost" @click="removePlayer">− Remove</button>
      </div>
      <button class="btn-start" :disabled="!canStart" @click="start">
        Launch Game 🚀
      </button>
    </div>

    <div class="rules-panel">
      <h3>How to Play</h3>
      <div class="rules-list">
        <div class="rule">
          <span class="rule-icon">🎲</span>
          <span>On your turn, roll 6 dice — each die shows a fruit: 🍌 🍫 🍓 🍊 🥕</span>
        </div>
        <div class="rule">
          <span class="rule-icon">✅</span>
          <span>Select a fruit type to keep — you collect <em>all</em> dice showing that fruit.</span>
        </div>
        <div class="rule">
          <span class="rule-icon">⏹</span>
          <span><strong>Stop</strong>: keep your collected dice. Unselected dice go to all opponents.</span>
        </div>
        <div class="rule">
          <span class="rule-icon">▶</span>
          <span><strong>Continue</strong>: save your current dice and re-roll only the leftover dice — but you're locked to the same fruit type!</span>
        </div>
        <div class="rule">
          <span class="rule-icon">💀</span>
          <span>If you continue and your locked fruit doesn't appear, opponents gain all those dice and your turn ends.</span>
        </div>
        <div class="rule">
          <span class="rule-icon">🏆</span>
          <span>After 6 rounds, whoever collected the most of each fruit wins that type. Most type wins = overall winner.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-area { text-align: center; }

.stars {
  font-size: 1.2rem;
  color: var(--gold);
  letter-spacing: 10px;
  margin-bottom: 10px;
}

h1 {
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa 0%, #ffd700 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.subtitle {
  color: var(--dim);
  margin-top: 8px;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.panel, .rules-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

h2 { font-size: 1.1rem; margin-bottom: 16px; color: var(--gold); }
h3 { font-size: 1rem; margin-bottom: 14px; color: var(--gold); }

.inputs { display: flex; flex-direction: column; gap: 10px; }

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-num {
  color: var(--dim);
  font-weight: 700;
  font-size: 0.8rem;
  width: 22px;
  text-align: center;
}

input {
  flex: 1;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s;
}
input:focus { border-color: var(--blue); }

.player-controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--dim);
  font-size: 0.85rem;
  padding: 7px 14px;
}

.btn-start {
  width: 100%;
  margin-top: 20px;
  background: linear-gradient(135deg, #4a7aff, #7c3aed);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 14px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.rule {
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--dim);
  line-height: 1.5;
}
.rule-icon { font-size: 1.1rem; flex-shrink: 0; }
.rule strong { color: var(--text); }
.rule em { color: var(--text); font-style: normal; }

.card-table {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  font-size: 0.85rem;
}

.ct-header, .ct-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr;
  padding: 9px 14px;
}

.ct-header {
  background: var(--card-bg);
  color: var(--dim);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}

.ct-row {
  border-bottom: 1px solid var(--border);
}
.ct-row:last-child { border-bottom: none; }

.ct-id { color: var(--gold); font-weight: 700; }
.ct-keep { color: var(--green); }
.ct-discard { color: var(--red); }
</style>
