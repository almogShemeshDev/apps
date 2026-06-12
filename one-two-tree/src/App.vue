<template>
  <div id="app">
    <!-- Setup -->
    <div v-if="state.phase === 'setup'" class="setup">
      <h1 class="title">🌳 One-Two-Tree</h1>
      <p class="subtitle">A trick-taking card game</p>

      <div class="form">
        <label>Number of players</label>
        <div class="player-count">
          <button
            v-for="n in [3, 4, 5]"
            :key="n"
            :class="{ active: playerCount === n }"
            @click="setPlayerCount(n)"
          >{{ n }}</button>
        </div>

        <div v-for="i in playerCount" :key="i" class="name-input">
          <label>Player {{ i }} name</label>
          <input v-model="names[i - 1]" :placeholder="`Player ${i}`" />
        </div>

        <button class="btn-start" @click="start">Start Game</button>
      </div>
    </div>

    <!-- Bidding phase -->
    <BiddingPhase v-else-if="state.phase === 'bidding'" />

    <!-- Game -->
    <GameBoard v-else-if="state.phase === 'playing' || state.phase === 'trick-resolved'" />

    <!-- Scores -->
    <ScoreBoard
      v-else-if="state.phase === 'game-over'"
      :scores="state.scores"
      @playAgain="resetGame"
    />

    <!-- Rules button — always visible -->
    <button class="btn-rules" @click="showRules = true">Rules</button>
    <RulesModal v-if="showRules" @close="showRules = false" />

    <footer class="credits">
      © 2026 Almog Shemesh &nbsp;·&nbsp; Game Design &amp; Concept &nbsp;·&nbsp; All rights reserved
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import BiddingPhase from './components/BiddingPhase.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import RulesModal from './components/RulesModal.vue'
import { useGameState } from './composables/useGameState.js'

const { state, startGame, resetGame } = useGameState()

const playerCount = ref(3)
const names = ref(['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'])
const showRules = ref(false)

function setPlayerCount(n) {
  playerCount.value = n
}

function start() {
  const playerNames = names.value.slice(0, playerCount.value).map((n, i) => n.trim() || `Player ${i + 1}`)
  startGame(playerNames)
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #1a4731;
}
.setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  color: #e8f5e9;
}
.title {
  font-size: 3rem;
  margin: 0;
  font-weight: 900;
}
.subtitle {
  color: rgba(255,255,255,0.5);
  margin: 0 0 16px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(0,0,0,0.25);
  padding: 32px;
  border-radius: 16px;
  min-width: 320px;
}
.form label {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-bottom: 4px;
}
.player-count {
  display: flex;
  gap: 8px;
}
.player-count button {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.2);
  background: transparent;
  color: #e8f5e9;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}
.player-count button.active {
  background: #38a169;
  border-color: #38a169;
}
.name-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.name-input input {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e8f5e9;
  font-size: 1rem;
  outline: none;
}
.name-input input:focus {
  border-color: #38a169;
}
.btn-start {
  margin-top: 8px;
  background: #38a169;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-start:hover {
  background: #2f855a;
}
.btn-rules {
  position: fixed;
  top: 16px;
  left: 16px;
  background: rgba(0,0,0,0.35);
  color: #e8f5e9;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 50;
}
.btn-rules:hover {
  background: rgba(255,255,255,0.12);
}
.credits {
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.25);
  pointer-events: none;
  letter-spacing: 0.03em;
}
</style>
