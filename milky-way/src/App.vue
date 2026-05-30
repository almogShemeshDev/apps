<script setup>
import { provide } from 'vue'
import { useGame } from './game.js'
import SetupScreen from './components/SetupScreen.vue'
import GameBoard from './components/GameBoard.vue'
import ScoreBoard from './components/ScoreBoard.vue'

const game = useGame()
provide('game', game)
</script>

<template>
  <div class="app">
    <SetupScreen v-if="game.state.phase === 'setup'" />
    <GameBoard v-else-if="game.state.phase === 'turn'" />
    <ScoreBoard v-else />
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #08081f;
  --surface: #111130;
  --card-bg: #1a1a45;
  --border: #2a2a66;
  --text: #dde0ff;
  --dim: #6668a0;
  --gold: #ffc700;
  --blue: #4a7aff;
  --green: #22dd88;
  --red: #ff4466;
  --purple: #9060ff;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
}

.app {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

button {
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  transition: opacity 0.15s, transform 0.1s;
}
button:hover:not(:disabled) { opacity: 0.85; }
button:active:not(:disabled) { transform: scale(0.97); }
button:disabled { opacity: 0.35; cursor: default; }
</style>
