<template>
  <div class="setup">
    <h1 class="title">Mansa's Tribute</h1>
    <p class="subtitle">A trick-taking dice game · 2–5 players</p>

    <div class="form">
      <div class="field">
        <label>Number of players</label>
        <div class="count-picker">
          <button
            v-for="n in [2, 3, 4, 5]"
            :key="n"
            :class="{ active: playerCount === n }"
            @click="playerCount = n"
          >{{ n }}</button>
        </div>
      </div>

      <div v-for="i in playerCount" :key="i" class="field">
        <label>Player {{ i }}</label>
        <input v-model="names[i - 1]" :placeholder="`Player ${i}`" />
      </div>

      <button class="btn-start" @click="start">Start Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])

const playerCount = ref(3)
const names = ref(['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'])

function start() {
  const list = names.value
    .slice(0, playerCount.value)
    .map((n, i) => n.trim() || `Player ${i + 1}`)
  emit('start', list)
}
</script>

<style lang="scss" scoped>
.setup {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}

.title {
  font-size: 2.6rem;
  font-weight: 900;
  color: var(--gold);
  letter-spacing: 0.04em;
}

.subtitle {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 28px 32px;
  border-radius: 16px;
  min-width: 300px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.78rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  input {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    color: var(--text);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.15s;

    &:focus { border-color: var(--gold); }
  }
}

.count-picker {
  display: flex;
  gap: 8px;

  button {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    border: 2px solid var(--border);
    background: transparent;
    color: var(--text);
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;

    &.active {
      background: var(--gold);
      border-color: var(--gold);
      color: #1a1208;
    }

    &:hover:not(.active) { border-color: rgba(255,255,255,0.3); }
  }
}

.btn-start {
  margin-top: 8px;
  background: var(--gold);
  color: #1a1208;
  border: none;
  padding: 13px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.15s;

  &:hover { background: var(--gold-light); }
}
</style>
